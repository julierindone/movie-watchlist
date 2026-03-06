import * as fetch from './src/fetch.js';
import * as helpers from './src/helpers.js';
import { createMovieObject } from './src/normalize.js';
import { generateExactResultHtml, generateFuzzyResultsHtml, generateWatchlistHtml } from './src/render.js';
import { onWatchlist } from './src/watchlist.js';


const searchBarWrapper = document.getElementById('search-bar-wrapper');
const searchForm = document.getElementById('search-form');
const searchBar = document.getElementById('search-bar');
const cardsWrapperClassQuery = document.querySelectorAll('.cards-wrapper');
const cardSection = document.getElementById('card-section');
export let watchlistArray = []
export function getWatchlistArray() {
  return watchlistArray;   // TEST DATA
}
export let resultsArray = [];
export let currentResultIndex = 0;

export function setCurrentResultIndex(lastIndex) {
  currentResultIndex = lastIndex;
}

  fuzzyCardsHTML = '';

setWatchlistArray();

/* ====================================== */
/* ========== LISTENERS ========== */
/* ====================================== */

if (document.getElementById('watchlist')) {
  console.log(getWatchlistArray())
  generateWatchlistHtml(watchlistArray)
}

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

// TODO: move to separate js file?
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
  if (data.Response === "False") {
    helpers.getSpaceSaver();
    return;
  }

  // reassign data to be stored in arrays
  data = fetch.toMovieArray(typeOfSearch, data);

  // create normalized array of movies
  resultsArray = data.map(movie => createMovieObject(movie, onWatchlist(movie.imdbID)));
  // create html by type
  typeOfSearch === "exact"
    ? generateExactResultHtml(resultsArray)
    : generateFuzzyResultsHtml(resultsArray)
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
