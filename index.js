import * as fetch from './src/fetch.js';
import * as helpers from './src/helpers.js';
import { createMovieObject } from './src/normalize.js';
import { generateExactResultHtml, generateFuzzyResultsHtml, generateWatchlistHtml } from './src/render.js';
import { watchlistArray, onWatchlist, initLocalStorageWatchlist } from './src/watchlist.js';

const searchBarWrapper = document.getElementById('search-bar-wrapper');
const searchForm = document.getElementById('search-form');
const searchBar = document.getElementById('search-bar');

export let resultsArray = [];
export let currentResultIndex = 0;
export function setCurrentResultIndex(lastIndex) {
  currentResultIndex = lastIndex;
}

// Check to see if watchlist exists in localStorage and create if it doesn't
initLocalStorageWatchlist();

/* ====================================== */
/* ========== LISTENERS ========== */
/* ====================================== */

if (document.getElementById('watchlist')) {
  if (watchlistArray.length > 0) {
    generateWatchlistHtml(watchlistArray);
  }
  else {
    helpers.getSpaceSaver('watchlist');
  }
}

document.addEventListener('click', (event) => {
  if (event.target.id === 'search-bar') {
    searchBarWrapper.classList.toggle('fancy-focus');
  }
  else if (event.target.dataset.imdbID) {
    handleWatchlistIconClick(event.target.dataset.imdbID);
  }
  else if (event.target.id === 'more-results-btn') {
    // generateFuzzyResultsHtml();
  }
  else {
    return;
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
    helpers.getSpaceSaver(data.Response);
    return;
  }

  // reassign data to be stored in arrays
  data = fetch.toMovieArray(typeOfSearch, data);

  // create normalized array of movies
  resultsArray = data.map(movie => createMovieObject(movie, onWatchlist(movie.imdbID)));

  // create html by type
  typeOfSearch === "exact"
    ? generateExactResultHtml(resultsArray)
    : generateFuzzyResultsHtml(resultsArray);
}

function getDetails() {
  // TODO: Onclick of details, fetch data from the exact match version of the movie selected so it can be opened in the expansion.
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
