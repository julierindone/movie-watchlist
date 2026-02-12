// // SHARED VARIABLES // //
const searchForm = document.getElementById('search-form');
const searchBarWrapper = document.getElementById('search-bar-wrapper');
const noResultMessage = document.getElementById('no-result-message');
const searchBar = document.getElementById('search-bar');
const cardsWrapper = document.querySelectorAll('.cards-wrapper');

// // FIND-FILM VARIABLES // //
const movieCardsWrapper = document.getElementById('movie-cards-wrapper');

// // WATCHLIST VARIABLES // //

let resultArray = [];
const localStorageWatchlist = JSON.parse(localStorage.getItem("watchlist"));
let watchlistArray = localStorageWatchlist;

// // SHARED LISTENERS // //

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

searchBar.addEventListener('blur', () => {
  searchBarWrapper.classList.remove('fancy-focus');
});

// TODO: Add listener to handle missing images
// https://dillionmegida.com/p/default-image-src/

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const key = 'aad30e17';
  const titleToSearch = (searchBar.value).replaceAll(' ', '+');
  let typeOfSearch = '';
  const typeNames = document.getElementsByName('type');
  for (let type of typeNames) {
    if (type.checked) {
      typeOfSearch = type.dataset.letter;
      break;
    }
  }

  const response = await fetch(`https://omdbapi.com/?${typeOfSearch}=${titleToSearch}&apikey=${key}`);
  const data = await response.json();

  if (data.Response !== "True") {
    let message = `I couldn't find that title. Check your spelling and try again.`;
    resetAll(message);
  }

  else {
    resetAll();

    if (typeOfSearch === 't') {
      getExactResult(data);
      generateExactResultHtml(resultArray);
    }
    else {
      getFuzzyResults(data);
      generateFuzzyResultsHtml(resultArray);
    }
  }
});

function getExactResult (data) {
  let thumbnail = getThumbnail(data);
  let rating = data.Ratings[1] ? data.Ratings[1].Value : "???";

  const movie = {
    title: data.Title,
    imdbId: data.imdbID,
    rating: rating,
    runtime: data.Runtime,
    year: data.Year,
    genre: data.Genre,
    plot: data.Plot,
    thumbnail: thumbnail,
    alt: `poster for ${data.Title}`
  };

  // check against watchlist to see if the movie is included. if it is, watchlist prop will be set to true.
  movie.watchlist = getWatchlistStatus(movie.imdbId);
  resultArray.push(movie);
}

// TODO: Limit to 10 entries and add "load more movies" button at bottom
function getFuzzyResults (data) {
  data.Search.forEach(currentMovie => {
    if (!(currentMovie.Title.toLowerCase().includes("commentary"))) {
      let thumbnail = getThumbnail(currentMovie);

      const movie = {
        title: currentMovie.Title,
        imdbId: currentMovie.imdbID,
        year: currentMovie.Year,
        thumbnail: thumbnail,
        alt: `poster for ${currentMovie.Title}`
      };

      // check against watchlist to see if the movie is included. if it is, watchlist prop will be set to true.
      movie.watchlist = getWatchlistStatus(movie.imdbId);
      resultArray.push(movie);
    }
  });
}

function getWatchlistStatus (chosenImdbId) {
  return watchlistArray.some(movie => movie.imdbId === chosenImdbId);
}

function generateExactResultHtml (resultArray) {
  let movie = resultArray[0];
  let watchlistIcon = (movie.watchlist === true) ? "check" : "plus";

  movieCardsWrapper.innerHTML = `
  <article class="movie-card">
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

  movieCardsWrapper.classList.replace('space-saver', 'cards');
}

function generateFuzzyResultsHtml (resultArray) {

  let allMovieCards = '';
  resultArray.forEach(movie => {
    allMovieCards +=
      `<article class="movie-card fuzzy-results">
        <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
        <div class="movie-details">
          <div class="title-watchlist">
            <h2>${movie.title}</h2>
            <i class="fa-solid fa-circle-plus" data-imdb-id="${movie.imdbId}"></i>
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

  movieCardsWrapper.classList.replace('space-saver', 'cards');
  movieCardsWrapper.innerHTML = allMovieCards;
}

function getThumbnail (data) {
  if ((data.Poster.toLowerCase() === "n/a") || (!data.Poster)) {
    return "assets/images/film_icon.png";
  }
  else {
    return data.Poster;
  }
}

function handleWatchlistIconClick (chosenImdbId) {
  // identify chosen movie in resultArray to get its watchlist status
  let chosenMovie = resultArray.filter(movie => {
    return movie.imdbId === chosenImdbId;
  })[0];

  // check chosenMovie.watchlist status to know if it's already on the watchjlist.
  // if it is, remove it.
  if (chosenMovie.watchlist) {

    // find the index of the movie in the watchlist
    for (let i = 0; i < watchlistArray.length; i++) {
      let movie = watchlistArray[i];

      //  when it finds the match, update watchlist status in movie object
      if (movie.imdbId === chosenImdbId) {
        chosenMovie.watchlist = false;

        // remove movie from watchlist
        watchlistArray.splice(i, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
      }
    }
  }

  // the movie needs to be added to watchlist
  else {
    // update watchlist value
    chosenMovie.watchlist = true;

    // add movie to array and push updated array to localStorage
    watchlistArray.push(chosenMovie);
    localStorage.setItem("watchlist", JSON.stringify(watchlistArray));

    // update icon to show checkmark
    document.querySelector(`[data-imdb-id="${chosenMovie.imdbId}"]`).classList.replace('fa-circle-plus', 'fa-circle-check');
  }
}

function resetAll (message = null) {
  cardsWrapper.forEach(wrapper => {
    wrapper.innerHTML = '';
    wrapper.classList.replace('cards', 'space-saver');
  resultArray = [];
  if (message === null) {
    message = '';
  }

    if (wrapper.id === 'movie-cards-wrapper') {
  movieCardsWrapper.innerHTML = `
  			<p id="no-result-message">${message}</p>
				<i class="fa-solid fa-film"></i>`;
    }
  });

  resultArray = [];
}

function getDetails () {
  // TODO: Onclick of details, fetch data from the exact match version of the movie selected so it can be opened in the expansion.
}
