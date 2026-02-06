const movieCardsWrapper = document.getElementById('movie-cards-wrapper')
const searchForm = document.getElementById('search-form')
const searchBarWrapper = document.getElementById('search-bar-wrapper')
const noResultMessage = document.getElementById('no-result-message')
const searchBar = document.getElementById('search-bar')
let resultArray = []
let allMovieCards = ``

searchBar.addEventListener('click', () => {
  searchBarWrapper.classList.toggle('fancy-focus')
})

searchBar.addEventListener('blur', () => {
  searchBarWrapper.classList.remove('fancy-focus')
})

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  // TODO: Might be better to use a different method to get this ONE field.
  const key = 'aad30e17'
  const searchData = Object.fromEntries(new FormData(searchForm))
  const titleToSearch = (searchData.title).replaceAll(' ', '+')
  let typeOfSearch = ''
  const typeNames = document.getElementsByName('type')
  for (let type of typeNames) {
    if (type.checked) {
      typeOfSearch = type.dataset.letter
      break
    }
  }

  const response = await fetch(`https://omdbapi.com/?${typeOfSearch}=${titleToSearch}&apikey=${key}`)
  const data = await response.json()

  if (data.Response !== "True") {
    let message = `I couldn't find that title. Check your spelling and try again.`
    resetAll(message)
  }

  else {
    resetAll()

    if (typeOfSearch === 't') {
      let exactResult = getExactResult(data)
      generateExactResultHtml(exactResult)
    }
    else {
      getFuzzyResults(data)
      generateFuzzyResultsHtml(resultArray)
    }
  }
})

function getExactResult(data) {
  let thumbnail = getThumbnail(data)
  let rating = data.Ratings[1] ? data.Ratings[1].Value : "???"

  return {
    title: `${data.Title}`,
    rating: `${rating}`,
    runtime: `${data.Runtime}`,
    year: `${data.Year}`,
    genre: `${data.Genre}`,
    watchlist: false,
    plot: `${data.Plot}`,
    thumbnail: `${thumbnail}`,
    alt: `poster for ${data.Title}`
  }
}

// TODO: Limit to 10 entries and add "load more movies" button at bottom
function getFuzzyResults(data) {
  data.Search.forEach(currentMovie => {
    if (!(currentMovie.Title.toLowerCase().includes("commentary"))) {
      let thumbnail = getThumbnail(currentMovie)

      const movie = {
        title: `${currentMovie.Title}`,
        year: `${currentMovie.Year}`,
        watchlist: false,
        thumbnail: `${thumbnail}`,
        alt: `poster for ${currentMovie.Title}`
      }

      resultArray.push(movie)
    }
  });
}

function generateExactResultHtml(exactResult) {
  let movie = exactResult

  // NOTE: p.watchlist class prob doesn't need to exist but I don't feel confident in changing it right now
  movieCardsWrapper.innerHTML = `
    <article class="movie-card">
      <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
      <div class="movie-details">
        <div class="title-watchlist">
          <h2>${movie.title}</h2>
          <p class="watchlist"><i class="fa-solid fa-circle-plus"></i></p>
        </div>
        <div class="runtime-year-genre-rating">
          <div class="runtime-year-genre">
            <p class="runtime-year">${movie.year}&ensp;${movie.runtime}</p>
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
    <hr class="card-divider">`

  movieCardsWrapper.classList.replace('space-saver', 'cards')
}

function generateFuzzyResultsHtml(resultArray) {

  resultArray.forEach(movie => {
    allMovieCards +=
      `<article class="movie-card fuzzy-results">
        <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
        <div class="movie-details">
          <div class="title-watchlist">
            <h2>${movie.title}</h2>
            <p class="watchlist"><i class="fa-solid fa-circle-plus"></i></p>
          </div>
          <p>${movie.year}</p>
          <details id="more">
            <summary>more</summary>
            <p>The other details will go here.</p>
          </details>
        </div>
      </article>
      <hr class="card-divider">`
  })

  movieCardsWrapper.classList.replace('space-saver', 'cards')
  movieCardsWrapper.innerHTML = allMovieCards
}

function getThumbnail(data) {
  if ((data.Poster.toLowerCase() === "n/a") || (!data.Poster)) {
    return "assets/images/film_icon.png"
  }
  else {
    return data.Poster
  }
}

function getDetails() {
  // TODO: Onclick of details, fetch data from the exact match version of the movie selected.
}

function resetAll(message = null) {
  movieCardsWrapper.innerHTML = ''
  resultArray = []
  allMovieCards = ''
  movieCardsWrapper.classList.replace('cards', 'space-saver')
  if (message === null) {
    message = ''
  }
  movieCardsWrapper.innerHTML = `
  			<p id="no-result-message">${message}</p>
				<i class="fa-solid fa-film"></i>`
}
