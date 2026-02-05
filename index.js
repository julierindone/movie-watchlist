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

  const searchData = Object.fromEntries(new FormData(searchForm))

  // TODO: REMOVE hardcoded searchType
  const searchType = 't'

  const titleToSearch = (searchData.title).replaceAll(' ', '+')
  const key = 'aad30e17'
  const response = await fetch(`https://omdbapi.com/?${searchType}=${titleToSearch}&apikey=${key}`)
  const data = await response.json()

  if (data.Response !== "True") {
    let message = `I couldn't find that title. Check your spelling and try again.`
    resetAll(message)
  }

  else {
    if (searchType === 't') {
      let exactResult = getExactResult(data)
      generateExactResultHtml(exactResult)
    }
    else {
      let results = getFuzzyResults(data)
      // console.log(results)
      // generateHtml(resultArray)
    }
  }
})

function getExactResult(data) {
  return {
    title: `${data.Title}`,
    rating: `${data.Ratings[1].Value}`,
    runtime: `${data.Runtime}`,
    year: `${data.Year}`,
    genre: `${data.Genre}`,
    watchlist: false,
    plot: `${data.Plot}`,
    thumbnail: `${data.Poster}`,
    alt: `poster for ${data.Title}`
  }
}

function getFuzzyResults(data) {
  data.Search.forEach(currentMovie => {
    if (!(currentMovie.Title.toLowerCase().includes("commentary"))) {
      const movie = {
        title: `${currentMovie.Title}`,
        year: `${currentMovie.Year}`,
        watchlist: false,
        thumbnail: `${currentMovie.Poster}`,
        alt: `poster for ${currentMovie.Title}`
      }

      resultArray.push(movie)
    }
  });
  // console.log(resultArray)
}

function generateExactResultHtml(exactResult) {
  let movie = exactResult

  movieCardsWrapper.innerHTML =
    `<article class="movie-card">
          <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
          <div class="movie-details">
            <div class="title-rating">
              <h2>${movie.title}</h2>
              <p><i class="fa-solid fa-star"></i>${movie.rating}</p>
            </div>
            <div class="runtime-year-list">
              <div>
                <p>${movie.runtime}</p>
                <p>${movie.year}</p>
              </div>
              <p class="watchlist">Watchlist <i class="fa-solid fa-circle-plus"></i></p>
            </div>
            <div class="genre">
              <p>${movie.genre}</p>
            </div>
            <p class="plot">${movie.plot}</p>
          </div>
        </article>
        <hr class="card-divider">`

  movieCardsWrapper.classList.replace('space-saver', 'cards')
  movieCardsWrapper.innerHTML = result
}

function generateFuzzyResultsHtml(resultArray) {
  resultArray.forEach(movie => {
    // movieCardsWrapper.innerHTML =
    //   `<article class="movie-card">
    //       <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
    //       <div class="movie-details">
    //         <div class="title-rating">
    //           <h2>${movie.title}</h2>
    //           <p><i class="fa-solid fa-star"></i>${movie.rating}</p>
    //         </div>
    //         <div class="runtime-year-list">
    //           <div>
    //             <p>${movie.runtime}</p>
    //             <p>${movie.year}</p>
    //           </div>
    //           <p class="watchlist">Watchlist <i class="fa-solid fa-circle-plus"></i></p>
    //         </div>
    //         <div class="genre">
    //           <p>${movie.genre}</p>
    //         </div>
    //         <p class="plot">${movie.plot}</p>
    //       </div>
    //     </article>
    //     <hr class="card-divider">`
    // })

    allMovieCards +=
      `<article class="movie-card">
        <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
        <div class="movie-details">
          <div class="title-rating">
            <h2>${movie.title}</h2>
            <p>${movie.year}</p>
          </div>
          <div class="runtime-year-list">
            <p class="watchlist">Watchlist <i class="fa-solid fa-circle-plus"></i></p>
          </div>
        </div>
      </article>
      <hr class="card-divider">`
  })

  movieCardsWrapper.classList.replace('space-saver', 'cards')
  movieCardsWrapper.innerHTML = allMovieCards
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


// FOR TESTING
// const movie = {
//   title: `Harold and Maude`,
//   rating: `10.0`,
//   runtime: `90 min`,
//   year: `1971`,
//   genre: ['comedy', 'romance', 'coming-of-age'],
//   watchlist: false,
//   plot: `Young, rich, and obsessed with death, Harold finds himself changed forever when he meets lively septuagenarian Maude at a funeral`,
//   // plot: `Young, rich, and obsessed with death, Harold finds himself changed forever`,
//   thumbnail: `assets/images/harold_and_maude.jpg`,
// }

// // SO not using this constructor.
// class Movie {
//   constructor() {
//     this.title = title
//     this.rating = rating
//     this.runtime = runtime
//     this.year = year
//     this.genre = genre
//     this.watchlist = watchlist
//     this.plot = plot
//     this.thumbnail = thumbnail
//     this.alt = alt
//   }
// }
