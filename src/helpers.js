import { resultsArray, setCurrentResultIndex } from '../index.js';

const main = document.getElementById('main');
const mainWrapper = document.getElementById('main-wrapper');

export function resetAll() {
	resultsArray.length = 0;
	setCurrentResultIndex();
	mainWrapper.innerHTML = '';
}

export function getSpaceSaver(message = '') {
	toggleMainSection('space-saver');

	if (message === 'False') {
		message = `<p>I couldn't find that title.<br>Check your spelling and try again.</p>`;
	}

	else if (message === '') {
		message = `<p>Something went wrong!<br>Please try again.</p>`;
	}

	main.innerHTML =
		`<div id="main-wrapper">
			<p>${message}</p>
			<i class="fa-solid fa-film"></i>
		</div>`;
}

export function toggleMainSection(goal) {
	if (goal === 'space-saver') {
		main.classList.add('space-saver');
		mainWrapper.classList.remove('card-wrapper');
	}
	else {
		main.classList.remove('space-saver');
		mainWrapper.classList.add('card-wrapper');
	}
}
