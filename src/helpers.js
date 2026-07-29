import { setCurrentResultIndex } from '../index.js';
import { resultsArray } from './search.js';

export function resetAll() {
	resultsArray.length = 0;
	setCurrentResultIndex();
	document.getElementById('main-wrapper').innerHTML = '';
}

export function getSpaceSaver(status) {
	let message;

	toggleMainSection('space-saver');

	// Empty watchlist
	if (status === 'watchlist') {
		message = `your watchlist is empty.</p>
		<p>visit the <a href="index.html">search page</a> to find your favorites.`;
	}
	// Title not found in API
	else if (status === "no_matches") {
		message = `I couldn't find that title.<br>Check your spelling and try again.`;
	}
	// what'a this for, and is it needed? i think maybe when connection broken...
	else {
		message = `Something went wrong!<br>Please try again.`;
	}
	document.getElementById('main').innerHTML =
		`<div id="main-wrapper">
			<p>${message}</p>
			<i class="fa-solid fa-film"></i>
		</div>`;
}

export function toggleMainSection(goal) {
	let mainWrapper = document.getElementById('main-wrapper');
	const listTypes = ['fuzzy', 'exact', 'watchlist'];
	if (goal === 'space-saver') {
		main.classList.add('space-saver')
		mainWrapper.classList.remove('card-wrapper', ...listTypes);
	}
	else {
		main.classList.remove('space-saver');
		mainWrapper.classList.add('card-wrapper');
		mainWrapper.classList.remove(...listTypes);
	}
}
