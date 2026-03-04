export async function fetchExact(query) {
	let url = `https://omdbapi.com/?t=${query}&apikey=aad30e17`;
	const response = await fetch(url);
	return response.json();
}

export async function fetchFuzzy(query) {
	let url = `https://omdbapi.com/?s=${query}&apikey=aad30e17`
	const response = await fetch(url);
	return response.json();
}
