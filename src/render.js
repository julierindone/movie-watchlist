import { toggleMainSection, resetAll } from './helpers.js';

const main = document.getElementById('main');
const mainWrapper = document.getElementById('main-wrapper');
let fuzzyCardsHTML = '';

// TODO: MOVE DOM stuff into separate function (maybe)
export function generateExactResultHtml(resultsArray) {
	let movie = resultsArray[0];
	let watchlistIcon = (movie.watchlist === true) ? "check" : "plus";

	let allMovieCards =
		`<article class="movie-card">
		<img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
			<div class="movie-details">
				<div class="title-watchlist">
					<h2>${movie.title}</h2>
					<i class="fa-solid fa-circle-${watchlistIcon}" data-imdb-id="${movie.imdbID}"></i>
				</div>
				<div class="runtime-year-genre-rating">
					<div class="runtime-year-genre">
						<p>${movie.year}&ensp;${movie.runtime}</p>
						<p class="genre">${movie.genre}</p>
					</div>
					<p id="rating">
					</p>
				</div>
				<p class="plot">${movie.plot}</p>
			</div>
		</article>
		<hr class="card-divider">`;

	toggleMainSection('card-wrapper');
	mainWrapper.innerHTML = '';
	mainWrapper.innerHTML = allMovieCards;
	generateRatingHtml(movie.rating);
}

export function generateFuzzyResultsHtml(resultsArray) {
	let fuzzyCardsHTML = '';
	for (let movie of resultsArray) {
		let watchlistIcon = (movie.watchlist === true) ? "check" : "plus";
		fuzzyCardsHTML +=
			`<article class="movie-card fuzzy-results">
				<img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
				<div class="movie-details">
					<div class="title-watchlist">
						<h2>${movie.title}</h2>
						<i class="fa-solid fa-circle-${watchlistIcon}" data-imdb-id="${movie.imdbID}"></i>
					</div>
					<p class="year">${movie.year}</p>
					<details id="more">
						<summary>more</summary>
						<div>
							<p>The other details will go here.</p>
						</div>
					</details>
				</div>
			</article>
			<hr class="card-divider">`;
	};

	toggleMainSection('card-wrapper');
	mainWrapper.innerHTML = '';
	mainWrapper.innerHTML = fuzzyCardsHTML;
}

export function generateWatchlistHtml(watchlistArray) {
	if (watchlistArray.length > 0) {
		let watchlistHtml = ``;

		watchlistArray.forEach(movie => {
			watchlistHtml +=
				`<article class="movie-card fuzzy-results">
					<img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
					<div class="movie-details">
						<div class="title-watchlist">
							<h2>${movie.title}</h2>
							<i class="fa-solid fa-circle-check" data-imdb-id="${movie.imdbId}"></i>
						</div>
						<p class="year">${movie.year}</p>
						<details id="more">
							<summary>more</summary>
							<div>
								<p>The other details will go here.</p>
							</div>
						</details>
					</div>
				</article>
				<hr class="card-divider">`;
		});

		toggleMainSection('card-wrapper');
		mainWrapper.innerHTML = '';
		mainWrapper.innerHTML = watchlistHtml;
	}

	else {
		resetAll();
	}
}

export function showNextChunk() {
	const chunkSize = 3;
	const resultsToAdd = resultsArray.slice(currentResultIndex, currentResultIndex + chunkSize);
	currentResultIndex += chunkSize;

	// if there aren't any more results, remove button.
	if (currentResultIndex >= resultsArray.length - 1) {
		document.getElementById('more-results-btn').style.display = 'none';
	}

	return resultsToAdd;
};

function generateRatingHtml(rating) {
	if (rating) {
		document.getElementById('rating').innerHTML =
			`<i class="fa-solid fa-star"></i>
		${rating}`;
	}
}
