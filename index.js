import * as fetch from './src/fetch.js';
import * as helpers from './src/helpers.js';

const searchBarWrapper = document.getElementById('search-bar-wrapper');
const searchForm = document.getElementById('search-form');
const searchBar = document.getElementById('search-bar');
const cardsWrapperClassQuery = document.querySelectorAll('.cards-wrapper');
const cardSection = document.getElementById('card-section');
let watchlistArray = [];
let cardWrapperType = '';
export let resultsArray = [];
export let currentResultIndex = 0;

export function setCurrentResultIndex(lastIndex) {
  currentResultIndex = lastIndex;
}

}

setWatchlistArray();

/* ====================================== */
/* ========== LISTENERS ========== */
/* ====================================== */

document.addEventListener('click', (event) => {
  if (event.target.id === 'search-bar') {
    searchBarWrapper.classList.toggle('fancy-focus');
  }
  else if (event.target.dataset.imdbId) {
    handleWatchlistIconClick(event.target.dataset.imdbId);
  }
  else {
    // console.log('')
  }
});

if (searchBar) {
  searchBar.addEventListener('blur', () => {
    searchBarWrapper.classList.remove('fancy-focus');
  });
}

if (searchForm) {
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    searchMovies();
  });
}

// TODO: Add listener to handle missing images
// https://dillionmegida.com/p/default-image-src/


/* ====================================== */
/* ========== FUNCTIONS ========== */
/* ====================================== */

// TODO: move to separate js file
async function searchMovies() {
  const query = (searchBar.value).replaceAll(' ', '+');
  const typeOfSearch = getSearchType();

  // start with clean search result data
  helpers.resetAll();

  // fetch data
  let data = typeOfSearch === "exact"
    ? await fetch.fetchExact(query)
    : await fetch.fetchFuzzy(query);

  // validate data
  if (!(fetch.isSuccessfulResponse(data))) {
    helpers.getSpaceSaver();
    return;
  }

  // reassign data to be stored in arrays
  data = fetch.toMovieArray(typeOfSearch, data);

  // create normalized array of movies
  let movies = data.map(createMovieObject);
}

function createMovieObject(movie) {
  let rating = (movie.Ratings && movie.Ratings[1])
    ? movie.Ratings[1].Value
    : null;

  return {
    title: movie.Title,
    imdbId: movie.imdbID,
    rating: rating,
    runtime: movie.Runtime ?? null,
    year: movie.Year ?? null,
    genre: movie.Genre ?? null,
    plot: movie.Plot ?? null,
    thumbnail: getThumbnail(movie.Poster) ?? null,
    alt: `poster for ${movie.Title}`,
    watchlist: getWatchlistStatus(movie.imdbID)
  };
}
  let allMovieCards = `<div id="exact-results-wrapper" class="cards-wrapper cards">`;
  let movie = resultsArray[0];
  let watchlistIcon = (movie.watchlist === true) ? "check" : "plus";

  allMovieCards +=
    `<article class="movie-card">
    <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
      <div class="movie-details">
        <div class="title-watchlist">
          <h2>${movie.title}</h2>
			    <i class="fa-solid fa-circle-${watchlistIcon}" data-imdb-id="${movie.imdbId}"></i>
        </div>
        <div class="runtime-year-genre-rating">
          <div class="runtime-year-genre">
            <p>${movie.year}&ensp;${movie.runtime}</p>
            <p class="genre">${movie.genre}</p>
          </div>
          <p class="rating">
            <i class="fa-solid fa-star"></i>
            ${movie.rating}
          </p>
        </div>
        <p class="plot">${movie.plot}</p>
      </div>
    </article>
    <hr class="card-divider">`;
  allMovieCards += `</div>`;

  cardSection.classList.remove('space-saver');
  cardSection.innerHTML = allMovieCards;
}

function generateFuzzyResultsHtml(resultsArray) {
  let allMovieCards = `<div id="fuzzy-results-wrapper" class="cards-wrapper cards">`;

  resultsArray.forEach(movie => {
    let watchlistIcon = (movie.watchlist === true) ? "check" : "plus";
    allMovieCards +=
      `<article class="movie-card fuzzy-results">
        <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
        <div class="movie-details">
          <div class="title-watchlist">
            <h2>${movie.title}</h2>
            <i class="fa-solid fa-circle-${watchlistIcon}" data-imdb-id="${movie.imdbId}"></i>
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

  allMovieCards += `</div>`;

  cardSection.classList.remove('space-saver');
  cardSection.innerHTML = allMovieCards;
}

function getThumbnail(poster) {
  if (!(poster.toLowerCase().startsWith("http"))) {
    return "assets/images/film_icon.png";
  }
  else {
    return poster;
  }
}

function handleWatchlistIconClick(currentImdbId) {
  let chosenMovie = '';

  // GET CHOSEN MOVIE
  if (cardSection.querySelector('#watchlist-cards-wrapper')) {
    // watchlistArray - find clicked movie & assign to chosenMovie
    chosenMovie = watchlistArray.find(movie => movie.imdbId === currentImdbId);
  }
  else {
    // resultsArray - find clicked movie & assign to chosenMovie
    chosenMovie = resultsArray.find(movie => movie.imdbId === currentImdbId);
  }

  // GET WATCHLIST STATUS

  // if it's on the watchlist, remove it
  if (chosenMovie.watchlist) {
    chosenMovie.watchlist = false;
    // get index and remove from watchlistArray
    let index = watchlistArray.findIndex(movie => movie.imdbId === chosenMovie.imdbId);
    watchlistArray.splice(index, 1);
  }
  else {
    chosenMovie.watchlist = true;
    watchlistArray.push(chosenMovie);
  }

  // update localStorage
  localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
  renderContent();
}

function getDetails() {
  // TODO: Onclick of details, fetch data from the exact match version of the movie selected so it can be opened in the expansion.
}

function setWatchlistArray() {
  const raw = localStorage.getItem("watchlist");

  // if it doesn't exist, create it.
  if (raw === null) {
    console.log("watchlist doesn't exist. Initializing.");
    localStorage.setItem("watchlist", JSON.stringify([]));
    watchlistArray = [];
    return;
  }

  // if it exists, parse it.
  try {
    watchlistArray = JSON.parse(raw);
  }

  // if there's a parsing error, completely reset it.
  catch (error) {
    console.log(`corrupted JSON. Resetting.`);
    watchlistArray = [];
    localStorage.setItem("watchlist", JSON.stringify([]));
  }
}

/* ====================================== */
/* ========== HELPER FUNCTIONS ========== */
/* ====================================== */

function getSearchType() {
  const searchTypes = document.getElementsByName('search-type');

  for (let type of searchTypes) {
    if (type.checked) {
      return type.dataset.searchType;
    }
  }
}

function renderContent() {
  cardWrapperType === "fuzzyResultsWrapper" ? generateFuzzyResultsHtml(resultsArray) :
    cardWrapperType === "exactResultsWrapper" ? generateExactResultHtml(resultsArray) :
      generateWatchlistHtml(watchlistArray);
}

function getWatchlistStatus(currentImdbId) {
  return watchlistArray.some(movie => movie.imdbId === currentImdbId);
}

function resetAll(hasResponse = true) {
  cardSection.classList.add('space-saver');
  resultsArray = [];
  getSpaceSaver(hasResponse);
}

function getSpaceSaver(hasResponse = true) {
  console.log(`in getSpaceSaver`);

  if (!hasResponse) {
    message = `<p>Something went wrong!<br>Please try again.</p>`;
  }

  else if (cardWrapperType === "fuzzyResultsWrapper" || cardWrapperType === "exactResultsWrapper") {
    message = `<p>I couldn't find that title.<br>Check your spelling and try again.</p>`;
  }
  else {
    message =
      `<p>your watchlist is empty.</p>
				<p>visit the <a href="index.html">search page</a> to find your favorites.</p>`;
  }

  cardSection.innerHTML =
    `<div id="results-space-saver">
      ${message}
      <i class="fa-solid fa-film"></i>
    </div>`;
}
