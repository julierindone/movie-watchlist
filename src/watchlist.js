import { resultsArray } from "./search.js";
import { renderHtml } from "./render.js";
import { createMovieObject } from "./normalize.js";
import { fetchFromImdbId } from "./fetch.js";

export let watchlistArray = [];

// get list from localStorage
function getLocalStorageWatchlist() {
	return JSON.parse(localStorage.getItem("watchlist"));
}

function setLocalStorageWatchlist() {
	localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
}

function resetLocalStorageWatchlist() {
	localStorage.setItem("watchlist", JSON.stringify([]));
}

// Check to see if localStorage has a usable watchlist ; if not, create/reset one.
export function initLocalStorageWatchlist() {
	let storedWatchlist = getLocalStorageWatchlist();

	if (storedWatchlist === null) {
		console.log("Watchlist doesn't exist. Initializing.");
		resetLocalStorageWatchlist();
		return;
	}

	// if it exists, parse it.
	try {
		watchlistArray = getLocalStorageWatchlist();
		return;
	}

	// if there's a parsing error, completely reset it.
	catch (error) {
		console.log(`Corrupted JSON. Resetting.`);
		watchlistArray = [];
		resetLocalStorageWatchlist();
	}
}

export async function handleWatchlistIconClick(clickedImdbID) {
	let movie = getClickedMovie(clickedImdbID);

	// add or remove as needed
	if (onWatchlist(movie.imdbID)) {
		removeFromWatchlist(movie);
	}
	else {
		// if full details not present, fetch to store in list
		if (!movie.genre) {
			movie = await processWatchlistAdd(movie);
		}
		addToWatchList(movie);
	}

	// set localStorage to match updated watchlist
	setLocalStorageWatchlist();

	// render content based on type of list
	renderHtml(resultsArray, watchlistArray);
}

function removeFromWatchlist(movie) {
	// change watchlist status in object in resultsArray
	if (document.getElementById('search-page')) {
		// let resultsIndex = getResultsIndex(movie.imdbID);
		let resultsIndex = resultsArray.findIndex(movieInResults => movieInResults.imdbID === movie.imdbID);
		resultsArray[resultsIndex].watchlist = false;
	};

	// remove movie from watchlist
	let watchlistIndex = getWatchlistIndex(movie.imdbID);
	watchlistArray.splice(watchlistIndex, 1);
}

function addToWatchList(movie) {
	// change watchlist status in object in resultsArray
	if (document.getElementById('search-page')) {
		console.log(`on search page`);
		let resultsIndex = getResultsIndex(movie.imdbID);
		resultsArray[resultsIndex].watchlist = true;
	};

	// change watchlist status in object
	movie.watchlist = true;

	// add movie to watchlist
	watchlistArray.push(movie);
}

function getClickedMovie(clickedImdbID) {
	if (document.getElementById('watchlist-page')) {
		return watchlistArray.find(movie => movie.imdbID === clickedImdbID);

	}
	else {
		return resultsArray.find(movie => movie.imdbID === clickedImdbID);
	}
}

export function onWatchlist(movieImdbID) {
	return watchlistArray.some(watchlistMovie => watchlistMovie.imdbID === movieImdbID);
}

function getWatchlistIndex(movieImdbID) {
	return watchlistArray.findIndex(movie => movie.imdbID === movieImdbID);
}

function getResultsIndex(movieImdbID) {
	return resultsArray.findIndex(movie => movie.imdbID === movieImdbID);
}

async function processWatchlistAdd(movie) {
	let data = await fetchFromImdbId(movie.imdbID);

	// process fetch datad
	if (data.Response === "False") {
		console.error("Response was false.");
		return;
	}
	console.log(`response was true. adding movie to watchlist.`);
	return createMovieObject(data);
}
