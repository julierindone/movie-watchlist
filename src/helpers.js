import { resultsArray, setCurrentResultIndex } from '../index.js';

export function resetAll() {
	document.getElementById('card-section').classList.replace('card-section', 'space-saver');
	resultsArray.length = 0;
	setCurrentResultIndex();
}

export function getSpaceSaver(message = '') {
	const cardSection = document.getElementById('card-section');
	if (message === '') {
		message = `<p>Something went wrong!<br>Please try again.</p>`;
	}
	cardSection.innerHTML =
		`<div id="results-space-saver">
			${message}
			<i class="fa-solid fa-film"></i>
		</div>`;
	cardSection.classList.replace('card-section', 'space-saver');
}


export function addSpaceSaverClass() {
	cardSection.classList.replace('card-section', 'space-saver');
}
