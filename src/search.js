import { createMovieObject } from './normalize.js';
import * as fetch from './fetch.js';
import * as helpers from './helpers.js';
import { onWatchlist } from './watchlist.js';
import { generateExactResultHtml, generateFuzzyResultsHtml, generateMoreDetails } from './render.js';

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

	// validate data
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

// TODO: Should go elsewhere since it's used on both search and watchlist pages!
export async function handleMoreDetailsClick(eTarget) {
	let detailsSummary = eTarget;
	const imdbID = detailsSummary.attributes[1].value;

	let data = await fetch.fetchDetails(detailsSummary, imdbID);

	// validate data
	if (data.Response === "False") {
		console.error("Response was false.");
		return;
	}

	movieDetails = createMovieObject(data);

	// Generate html
	generateMoreDetails(detailsSummary, movieDetails);
}

export async function handleLessDetailsClick() {
	const detailsDiv = document.getElementById('less-details').closest('.details-div');
	detailsDiv.style.display = 'none';
	console.log();

}
