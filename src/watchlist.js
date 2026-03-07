import { watchlistArray } from '../index.js';

// TESTING:
export let fakeLocalStorage = [
	{ title: 'Ghost World', watchlist: false, imdbID: 'tt0162346', rating: '93 % ', runtime: '111 min', year: '2001', thumbnail: "./assets/images/film_icon.png" },
	{ title: 'Amelie', watchlist: false, imdbID: '123', rating: '93 % ', runtime: '111 min', year: '2001', thumbnail: "./assets/images/film_icon.png" }
];

export function onWatchlist(movieImdbID) {
	return watchlistArray.some(watchlistMovie => watchlistMovie.imdbID === movieImdbID);
}

// To get list from LOCALSTORAGE
export function getLocalStorageWatchlist() {
	// return localStorage.getItem("watchlist");
	return fakeLocalStorage;   // TESTING DATA

}
function setLocalStorageWatchlist(movie) {
	// localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
	fakeLocalStorage = watchlistArray;   // TESTING DATA
	console.log("fakeLocalStorage after setWatchlistArray: ", fakeLocalStorage);
}

function resetWatchlist() {
	// localStorage.setItem("watchlist", JSON.stringify([]));
	fakeLocalStorage = []; // TESTING
}

