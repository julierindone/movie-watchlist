
// FOR TESTING
const movie = {
  title: `Harold and Maude`,
  rating: `10.0`,
  runtime: `90 min`,
  release: `1971`,
  genres: ['comedy', 'romance', 'coming-of-age'],
  watchlist: false,
  plot: `Young, rich, and obsessed with death, Harold finds himself changed forever when he meets lively septuagenarian Maude at a funeral`,
  thumbnail: `assets/images/harold_and_maude.jpg`,
}

const movieCardsWrapper = document.getElementById('movie-cards-wrapper')

let allMovieCards = ``

const genreArray = movie.genres
const genres = genreArray.join(', ')
const alt = `title card for ${movie.title}`

function generateHtml() {
  let cardHtml = `
    <article class="movie-card">
      <img class="thumbnail" src="${movie.thumbnail}" alt="${movie.alt}">
      <div class="movie-details">
        <div class="title-rating">
          <h2>${movie.title}</h2>
          <p><i class="fa-solid fa-star"></i>${movie.rating}</p>
        </div>
        <div class="runtime-year-list">
          <div>
            <p>${movie.runtime}</p>
            <p>${movie.release}</p>
          </div>
          <p class="watchlist">Watchlist <i class="fa-solid fa-circle-plus"></i></p>
        </div>
        <div class="genres">
          <p>${genres}</p>
        </div>
        <p class="plot">${movie.plot}</p>
      </div>
    </article>
    <hr class="card-divider">`
  allMovieCards += cardHtml
  movieCardsWrapper.innerHTML = allMovieCards
}
generateHtml(movie)