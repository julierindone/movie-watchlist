import { resultsArray } from "./search.js";
// import { generateWatchlistHtml, generateExactResultHtml, generateFuzzyResultsHtml } from "./render.js";
import { renderHtml } from "./render.js";

export let watchlistArray = [];
const mainWrapper = document.getElementById('main-wrapper');

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

export function handleWatchlistIconClick(clickedImdbID) {
	let clickedMovie = getClickedMovie(clickedImdbID);

	// add or remove as needed
	onWatchlist(clickedMovie.imdbID)
		? removeFromWatchlist(clickedMovie)
		: addToWatchList(clickedMovie);

	// set localStorage to match updated watchlist
	setLocalStorageWatchlist();

	// render content based on type of list
	renderHtml(resultsArray, watchlistArray);
}

function removeFromWatchlist(movie) {
	// change watchlist status in object
	movie.watchlist = false;

	// remove movie from watchlist
	let index = getMovieIndex(movie.imdbID);
	watchlistArray.splice(index, 1);
}

function addToWatchList(movie) {
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

function getMovieIndex(movieImdbID) {
	return watchlistArray.findIndex(movie => movie.imdbID === movieImdbID);
}
