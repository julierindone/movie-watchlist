import { getSpaceSaver } from "./helpers.js";
import { generateMoreDetailsError } from './render.js';

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

export async function fetchFromImdbId(imdbID, detailsSummary = null) {
	let url = `https://omdbapi.com/?i=${imdbID}&apikey=aad30e17`;

	try {
		const response = await fetch(url);
		return response.json();
	}
	catch (error) {
		// not using for watchlist-related use, but i think the param is needed for the error message I'll be adding back in.
		if (detailsSummary !== null) {
			generateMoreDetailsError(detailsSummary);
		}
		console.error(error);
	}
}

export function toMovieArray(typeOfSearch, data) {
	return typeOfSearch === "exact" ? [data] : data.Search;
}
