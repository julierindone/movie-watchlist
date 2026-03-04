export function createMovieObject(movie) {

	return {
		title: movie.Title,
		imdbId: movie.imdbID,
		rating: getRating(movie.Ratings),
		runtime: movie.Runtime ?? null,
		year: movie.Year ?? null,
		genre: movie.Genre ?? null,
		plot: movie.Plot ?? null,
		thumbnail: getThumbnail(movie.Poster) ?? null,
		alt: `poster for ${movie.Title}`,
		// Do I add the watchlist status here? Or do i have to check for it elsewhere?
		// watchlist: getWatchlistStatus(movie.imdbID)
	};
}

function getThumbnail(poster) {
	return (!(poster.toLowerCase().startsWith("http"))) ? "assets/images/film_icon.png" : poster
}

function getRating(ratingsArray) {
	return (ratingsArray && ratingsArray[1]) ? ratingsArray[1].Value : null
}

