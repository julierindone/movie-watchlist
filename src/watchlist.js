import { watchlistArray } from '../index.js';

export function onWatchlist(movieImdbID) {
	return watchlistArray.some(watchlistMovie => watchlistMovie.imdbID === movieImdbID);
}




