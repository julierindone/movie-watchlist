import { createMovieObject } from './normalize.js';
import * as fetch from './fetch.js';
import * as helpers from './helpers.js';
import { onWatchlist } from './watchlist.js';
import { generateExactResultHtml, generateFuzzyResultsHtml, generateMoreDetails, generateMoreDetailsError } from './render.js';

const searchBar = document.getElementById('search-bar');

export let resultsArray = [];
export let movieDetails = {};

export async function searchMovies() {
	const query = (searchBar.value).replaceAll(' ', '+');
	const typeOfSearch = getSearchType();

	helpers.resetAll();

	// fetch data
	let data = typeOfSearch === "exact"
		? await fetch.fetchExact(query)
		: await fetch.fetchFuzzy(query);

	// validate data - for when title(s) not found in API
	if (data.Response === "False") {
		helpers.getSpaceSaver(data.Response);
		return;
	}

	// reassign data to be stored in arrays
	data = fetch.toMovieArray(typeOfSearch, data);

	// create normalized array of movies
	resultsArray = data.map(movie => createMovieObject(movie, onWatchlist(movie.imdbID)));

	// create html by type
	typeOfSearch === "exact"
		? generateExactResultHtml(resultsArray)
		: generateFuzzyResultsHtml(resultsArray);
}

function getSearchType() {
	const searchTypes = document.getElementsByName('search-type');

	for (let type of searchTypes) {
		if (type.checked) {
			return type.dataset.searchType;
		}
	}
}

export function handleImageError(brokenImage) {
	brokenImage.src = './assets/images/film_icon.png';
	brokenImage.alt = 'film poster not found';
}

// TODO: add error message back in here in next commit. Return might have been messing things up.
// TODO: Refactor to use details tag
export async function handleMoreDetailsClick(eTarget) {
	const imdbID = eTarget.attributes[1].value;

	let data = await fetch.fetchFromImdbId(imdbID, eTarget);
	// if it can't find the imdbId (like if it doesn't exist)
	if (data.Response === "False") {
		let moreDetailsDiv = eTarget.parentElement.querySelector('details-div');
		generateMoreDetailsError(eTarget);
		console.error("Response was false.");
	}

	movieDetails = createMovieObject(data);
	generateMoreDetails(eTarget, movieDetails);
}

export async function handleLessDetailsClick(eTarget) {
	const details = eTarget.closest('details');

	if (details) {
		// TODO: I'd moved this out of the details conditional in the stash... why?
		const summary = details.querySelector('summary');
		details.removeAttribute('open');
		summary.style.display = 'unset';
	}
}
