import { getSpaceSaver } from "./helpers.js";
import { generateMoreDetailsError } from './render.js'

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

export async function fetchDetails(detailsSummary, imdbID) {
	let url = `https://omdbapi.com/?i=${imdbID}&apikey=aad30e17`;

	try {
		const response = await fetch(url);
		return response.json();
	}
	catch (error) {
		generateMoreDetailsError(detailsSummary)
		console.error(error);
	}
}

function isSuccessfulResponse(data) {
	return data.Response === "True";
}

export function toMovieArray(typeOfSearch, data) {
	return typeOfSearch === "exact" ? [data] : data.Search;
}
