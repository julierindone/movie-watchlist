// CURRENT RENDER
import { toggleMainSection, resetAll } from './helpers.js';
import { watchlistArray } from './watchlist.js';
import { resultsArray } from './search.js';

const mainWrapper = document.getElementById('main-wrapper');

// TODO: MOVE DOM stuff into separate function (maybe)
export function generateExactResultHtml(resultsArray) {
	let movie = resultsArray[0];
	let watchlistIcon = (movie.watchlist === true) ? "check" : "plus";
	let rating = generateRatingHtml(movie.rating);

	// note: removed imdb-id from article el but can't remember why so I may need to add it back in.
	let html =
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
				${rating}
			</div>
			<p class="plot">${movie.plot}</p>
		</div>
		</article>
		<hr class="card-divider">`;

	toggleMainSection('card-wrapper');
	mainWrapper.classList.add('exact');
	mainWrapper.innerHTML = html;
}

export function generateFuzzyResultsHtml(resultsArray) {
	let fuzzyCardsHTML = '';
	for (let movie of resultsArray) {
		let watchlistIcon = (movie.watchlist === true) ? "check" : "plus";
		fuzzyCardsHTML +=
			`<article class="movie-card fuzzy-results" data-imdb-id="${movie.imdbID}">
				<img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
				<div class="movie-details">
					<div class="title-watchlist">
						<h2>${movie.title}</h2>
						<i class="fa-solid fa-circle-${watchlistIcon}" data-imdb-id="${movie.imdbID}"></i>
					</div>
					<p class="year">${movie.year}</p>
					<details class="more-details">
						<summary class="details-summary" data-imdb-id="${movie.imdbID}">more</summary>
						<div class="details-div"></div>
					</details>
				</div>
			</article>
			<hr class="card-divider">`;
	};

	toggleMainSection('card-wrapper');
	mainWrapper.classList.add('fuzzy');
	mainWrapper.innerHTML = fuzzyCardsHTML;
}

export function generateWatchlistHtml() {
	if (watchlistArray.length > 0) {
		let html = ``;

		watchlistArray.forEach(movie => {
			let rating = generateRatingHtml(movie.rating);
			html +=
				`<article class="movie-card">
					<img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
					<div class="movie-details">
						<div class="title-watchlist">
							<h2>${movie.title}</h2>
							<i class="fa-solid fa-circle-check" data-imdb-id="${movie.imdbID}"></i>
						</div>
						<div class="runtime-year-genre-rating">
							<div class="runtime-year-genre">
								<p>${movie.year}&emsp;${movie.runtime}</p>
								<p class="genre">${movie.genre}</p>
							</div>
							${rating}
						</div>
						<p class="plot">${movie.plot}</p>
					</div>
				</article>
				<hr class="card-divider">`;
		});

		toggleMainSection('card-wrapper');
		mainWrapper.classList.add('watchlist');
		mainWrapper.innerHTML = html;
	}

	else {
		resetAll();
	}
}

function showNextChunk() {
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
		return `
			<p id="rating">
				<i class="fa-solid fa-star"></i>
				${rating}
			</p>`;
	}
	else {
		return '';
	}
}

// render content based on type of list
export function renderHtml() {
	mainWrapper.classList.contains('fuzzy') ? generateFuzzyResultsHtml(resultsArray)
		: mainWrapper.classList.contains('exact') ? generateExactResultHtml(resultsArray)
			: generateWatchlistHtml();
}

export function generateMoreDetails(detailsSummary, movieDetails) {
	detailsSummary.style.display = 'none';
	let rating = generateRatingHtml(movieDetails.rating);
	let detailsHTML = `
		<div class="runtime-year-genre-rating">
			<div class="runtime-year-genre">
					<p>${movieDetails.runtime}</p>
					<p class="genre">${movieDetails.genre}</p>
			</div>
			${rating}
		</div>
		<p class="plot">${movieDetails.plot}</p>
		<button class="less-details">less</button>
		`;

	detailsSummary.nextElementSibling.innerHTML = detailsHTML;
	generateRatingHtml(movieDetails.rating);
}

// TODO: Make operational for SEARCH ONLY. I Think the watch one should be a separate function.
export function generateMoreDetailsError(detailsSummary) {
	// targets div.details-div when in the fuzzy search list.
	detailsSummary.nextElementSibling.innerHTML = '<p class="no-details-error">No further details were found.</p>';
	detailsSummary.style.display = 'none';
}
