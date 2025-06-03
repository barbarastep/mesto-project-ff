const cardsContainer = document.querySelector('.places__list');

// Создание карточки
function createCard(data, onDelete) {
  const card = document.querySelector('#card-template').content.querySelector('.card').cloneNode(true);
  const image = card.querySelector('.card__image');
  const buttonDelete = card.querySelector('.card__delete-button');
  const title = card.querySelector('.card__title');

  title.textContent = data.name;
  image.src = data.link;
  image.alt = data.name;

  buttonDelete.addEventListener('click', () => {
    onDelete(card);
  });

  return card;
}

// Удаление карточки
function deleteCard(element) {
  element.remove();
}

initialCards.forEach(data => {
  const card = createCard(data, deleteCard);
  cardsContainer.appendChild(card);
});
