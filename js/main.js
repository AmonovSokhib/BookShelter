let elCheckbox = document.querySelector('#checkbox');
let elBookmark = document.querySelector('.bookmark__btn');
let elMoreInfo = document.querySelector('.more__info');
let newDiv2 = document.querySelector('.modal-header');
let elBookLisitWrapper = document.querySelector('.book-list');
let elSearch = document.querySelector('.input__search');
let elResultNum = document.querySelector('.results-number');
let elForm = document.querySelector('.search__input');
let elBookmarkCardsWrapper = document.querySelector('.bookmark__wrapper');
let elModalWrapper = document.querySelector('.modal__wrapper');

// Template
let elBookTemp = document.querySelector('#bookTemp').content;
let elBookmarkTemp = document.querySelector('#bookmarkTemp').content;

elForm.addEventListener('submit', function (evt) {
	evt.preventDefault();

	fetch(
		`https://books.googleapis.com/books/v1/volumes?maxResults=12&orderBy=newest&q=${elSearch.value.trim()}`,
	)
		.then((res) => res.json())
		.then((data) => {
			renderBook(data.items),
				renderModal(data.items),
				(elResultNum.textContent = data.totalItems);
		});
});

elCheckbox.addEventListener('change', () => {
	document.body.classList.toggle('dark');
});
let bookmarkArray = [];

elBookLisitWrapper.addEventListener('click', function (evt) {
	let bookmarkId = evt.target.dataset.btnookmarkId;
	let moreInfoId = evt.target.dataset.modalId;
	if (moreInfoId) {
		modal.classList.add('active');
	}
	fetch(
		`https://books.googleapis.com/books/v1/volumes?maxResults=12&orderBy=newest&q=${elSearch.value.trim()}`,
	)
		.then((res) => res.json())
		.then((data) => {
			if (bookmarkId) {
				let foundbook = data.items.find((item) => {
					return bookmarkId == item.id;
				});

				if (bookmarkArray.length == 0) {
					bookmarkArray.unshift(foundbook);
				} else {
					let check = false;
					for (const item of bookmarkArray) {
						if (item.id == bookmarkId) {
							check = true;
						}
					}

					if (!check) {
						bookmarkArray.unshift(foundbook);
					}
				}
			}

			renderBookmark(bookmarkArray, elBookmarkCardsWrapper);
		});
});

function renderBook(array) {
	elBookLisitWrapper.innerHTML = null;
	let newFragment = document.createDocumentFragment();

	for (const item of array) {
		let newLi = elBookTemp.cloneNode(true);

		let pattern = new RegExp(elSearch.value.trim(), 'gi');
		item.volumeInfo.title.match(pattern);

		newLi.querySelector('.item__img').src =
			item.volumeInfo.imageLinks.thumbnail;
		newLi.querySelector('.item__title').textContent = item.volumeInfo.title;
		newLi.querySelector('.item__subtitle').textContent =
			item.volumeInfo.authors;
		newLi.querySelector('.item__year').textContent =
			item.volumeInfo.publishedDate;
		newLi.querySelector('.bookmark__btn').dataset.btnookmarkId = item.id;
		newLi.querySelector('.more__info').dataset.modalId = item.id;
		newLi.querySelector('.read__book').href = item.volumeInfo.infoLink;
		newLi.querySelector('.read__book').setAttribute = ('target', 'blank');

		newFragment.appendChild(newLi);
	}
	elBookLisitWrapper.appendChild(newFragment);
}

function renderBookmark(array, wrapper) {
	wrapper.innerHTML = null;
	let newFragment = document.createDocumentFragment();

	for (const item of array) {
		let newLi = elBookmarkTemp.cloneNode(true);
		newLi.querySelector('.item__title').textContent = item.volumeInfo.title;
		newLi.querySelector('.item__subtitle').textContent =
			item.volumeInfo.authors;
		newLi.querySelector('.book-open').href = item.volumeInfo.infoLink;
		newLi.querySelector('.book-open').setAttribute = ('target', 'blank');
		newLi.querySelector('.delete-icon').dataset.imagesId = item.id;
		newFragment.appendChild(newLi);
	}
	elBookmarkCardsWrapper.appendChild(newFragment);
}
elBookmarkCardsWrapper.addEventListener('click', function (evt) {
	let currentBtn = evt.target.dataset.imagesId;
	if (currentBtn) {
		let indexOfItem = bookmarkArray.findIndex(function (item) {});
		bookmarkArray.splice(indexOfItem, 1);
		renderBookmark(bookmarkArray, elBookmarkCardsWrapper);
	}
});

function renderModal(array) {
	let newFragment = document.createDocumentFragment();
	for (const item of array) {
		let newDiv1 = document.createElement('div');

		let newDiv2 = document.createElement('div');
		newDiv2.classList = 'modal-header';
		let newDiv3 = document.createElement('div');
		newDiv3.classList = 'modal-title';
		newDiv3.textContent = item.volumeInfo.title;
		let newDiv4 = document.createElement('div');
		newDiv4.classList = 'modal_body';
		let newDiv5 = document.createElement('div');
		newDiv5.classList = 'modal-body__title';
		newDiv5.textContent = item.searchInfo.textSnippet;
		let newBtn = document.createElement('button');
		newBtn.classList = 'close-button';
		let newIcon = document.createElement('img');
		newIcon.src = './img/x.png';

		let newImg = document.createElement('img');
		newImg.src = item.volumeInfo.imageLinks.thumbnail;
		newImg.classList = 'pyton__book';

		newDiv1.appendChild(newDiv2);
		newDiv1.appendChild(newDiv4);
		newDiv2.appendChild(newDiv3);
		newDiv2.appendChild(newBtn);
		newBtn.appendChild(newIcon);
		newDiv4.appendChild(newImg);
		newDiv4.appendChild(newDiv5);

		newFragment.appendChild(newDiv1);
	}
	elModalWrapper.append(newFragment);
}
