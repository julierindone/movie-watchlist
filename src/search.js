import { createMovieObject } from './normalize.js';
import * as fetch from './fetch.js';
import * as helpers from './helpers.js';
import { onWatchlist } from './watchlist.js';
import { generateExactResultHtml, generateFuzzyResultsHtml, generateMoreDetails, generateMoreDetailsError } from './render.js';

const searchBar = document.getElementById('search-bar');

export let resultsArray = [];
export let movieDetails = {};
export let searchType = null;
export function setSearchType(value) { searchType = value; }

export async function searchMovies() {
	const query = (searchBar.value).replaceAll(' ', '+');
	setSearchType(getSearchType());
	helpers.resetAll();

	// fetch data
	let data = searchType === "exact"
		? await fetch.fetchExact(query)
		: await fetch.fetchFuzzy(query);

	// validate data - for when title(s) not found in API
	if (data.Response.toLowerCase() === "false") {
		helpers.getSpaceSaver('no_matches');
		console.error("Title not found.");
		return;
	}

	// reassign data to be stored in arrays
	data = fetch.toMovieArray(searchType, data);

	// create normalized array of movies
	resultsArray = data.map(movie => createMovieObject(movie, onWatchlist(movie.imdbID)));

	// TODO: Couldn't I be calling renderHTML from here?
	// create html by type
	searchType === "exact"
		? generateExactResultHtml(resultsArray)
		: generateFuzzyResultsHtml(resultsArray);
}

function getSearchType() {
	const searchTypes = document.getElementsByName('search-type');

	// Determine fuzzy search, exact search, or the watchlist page since var is also used to determine type of list.
	let currentType = Array.from(searchTypes).filter(type => type.checked)[0];

	let typeOfSearch = currentType.id.includes('exact')
		? 'exact'
		: currentType.id.includes('fuzzy')
			? 'fuzzy'
			: 'watchlist';
	return typeOfSearch;
}

export function handleImageError(brokenImage) {
	brokenImage.src = './assets/images/film_icon.png';
	brokenImage.alt = 'film poster not found';
}

// TODO: Refactor to use details tag (HUH???)
export async function handleMoreDetailsClick(eTarget) {
	const imdbID = eTarget.dataset.imdbId;

	try {
		let data = await fetch.fetchFromImdbId(imdbID);

		if (data.Response === "False") {
			generateMoreDetailsError(eTarget);
			return null;
		}

		movieDetails = createMovieObject(data);
		generateMoreDetails(eTarget, movieDetails);
	}

	catch {
		generateMoreDetailsError(eTarget);
		return null;
	}
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
