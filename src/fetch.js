import { getSpaceSaver } from "./helpers.js";
import { generateAddDetailsToWatchlistItemError, generateMoreDetailsError } from './render.js';

export async function fetchExact(query) {
	let url = `https://omdbapi.com/?t=${query}&apikey=aad30e17`;
	try {
		const response = await fetch(url);
		return response.json();
	}
	catch (error) {
		getSpaceSaver();
		console.error(error);
	}
}

export async function fetchFuzzy(query) {
	let url = `https://omdbapi.com/?s=${query}&apikey=aad30e17`;
	try {
		const response = await fetch(url);
		return response.json();
	}
	catch (error) {
		getSpaceSaver();
		console.error(error);
	}
}

export async function fetchFromImdbId(imdbID, errorMessageDiv) {
	let url = `https://omdbapi.com/?i=${imdbID}&apikey=aad30e17`;

	try {
		const response = await fetch(url);
		return response.json();
	}
	catch (error) {
		if (errorMessageDiv.classList.contains('details-div')) {
			generateAddDetailsToWatchlistItemError(errorMessageDiv);
		}
		else {
			generateMoreDetailsError(errorMessageDiv);
		}
		console.error(error);
	}
}

export function toMovieArray(typeOfSearch, data) {
	return typeOfSearch === "exact" ? [data] : data.Search;
}
