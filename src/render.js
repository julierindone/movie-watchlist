// TODO: A bunch of classes and IDs will need to be changed if the changes i made here survive adding the watchlist,
// TODO: some css tweaks (huge padding inline!)
// TODO: .card-section might be better named as .main so it's less confusing.
// TODO: watchlist html generator will also need to be updated.

const cardSection = document.getElementById('card-section');
// TODO id needs to be changed
const cardsWrapper = document.getElementById('results-space-saver');
let fuzzyCardsHTML = '';

export function generateExactResultHtml(resultsArray) {
	cardsWrapper.classList.add('cards-wrapper');
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

	cardsWrapper.innerHTML = allMovieCards;
	generateRatingHtml(movie.rating);
	toggleCardSectionClasses('card-section');
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

	toggleCardSectionClasses('card-section');
	cardsWrapper.classList.add('cards-wrapper');
	cardsWrapper.innerHTML = fuzzyCardsHTML;
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

function toggleCardSectionClasses(newClass) {
	if (newClass === 'card-section') {
		cardSection.classList.replace('space-saver', 'card-section');
	}
	else {
		cardSection.classList.replace('card-section', 'space-saver');
	}
}

function generateRatingHtml(rating) {
	if (rating) {
		document.getElementById('rating').innerHTML =
			`<i class="fa-solid fa-star"></i>
		${rating}`;
	}

	function resetCardSection() {
		cardSection.innerHTML = '';
		toggleCardSectionClasses('space-saver');
	}
}