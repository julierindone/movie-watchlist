import * as helpers from './src/helpers.js';
import { generateWatchlistHtml } from './src/render.js';
import { searchMovies, handleImageError, handleMoreDetailsClick, handleLessDetailsClick } from './src/search.js';
import { initLocalStorageWatchlist, handleWatchlistIconClick, watchlistArray } from './src/watchlist.js';

const searchBarWrapper = document.getElementById('search-bar-wrapper');
const searchForm = document.getElementById('search-form');
const searchBar = document.getElementById('search-bar');

export let currentResultIndex = 0;
export function setCurrentResultIndex(lastIndex) {
  currentResultIndex = lastIndex;
}

// Check to see if watchlist exists in localStorage and create if it doesn't
initLocalStorageWatchlist();

/* ====================================== */
/* ========== LISTENERS ========== */
/* ====================================== */

if (document.getElementById('watchlist-page')) {
  if (watchlistArray.length > 0) {
    generateWatchlistHtml();
  }
  else {
    helpers.getSpaceSaver('watchlist');
  }
}

document.addEventListener('click', (event) => {
  if (event.target.id === 'search-bar') {
    searchBarWrapper.classList.toggle('fancy-focus');
  }
  else if (event.target.id === 'more-results-btn') {
    // generateFuzzyResultsHtml();
  }
  else if (event.target.dataset.imdbId) {
    if (event.target.classList.contains('fa-solid')) {
      handleWatchlistIconClick(event.target.dataset.imdbId);
    }
    else if (event.target.classList.contains('details-summary')) {
      handleMoreDetailsClick(event.target);
    }
  }
  else if (event.target.id === 'less-details') {
    handleLessDetailsClick();
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

document.getElementById('main-wrapper').addEventListener('error', (event) => {
  const brokenImage = event.target;
  if (brokenImage.tagName === "IMG" && brokenImage.classList.contains("thumbnail")) {
    handleImageError(brokenImage);
  }
}, true);
