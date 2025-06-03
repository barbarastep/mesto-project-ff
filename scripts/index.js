// Создание карточки
function createCard(data, onDelete) {
  const card = document.querySelector('#card-template').content.querySelector('.card').cloneNode(true);
  const image = card.querySelector('.card__image');
  const buttonDelete = card.querySelector('.card__delete-button');
  const litle = card.querySelector('.card__title');

  litle.textContent = data.name;
  image.src = data.link;
  image.alt = data.name;

  buttonDelete.addEventListener('click', () => {
    onDelete(card);
  });

  return card;
}

const cardList = document.querySelector('.places__list');

// Удаление карточки
function deleteCard(element) {
  element.remove();
}

initialCards.forEach(data => {
  const card = createCard(data, deleteCard);
  cardList.appendChild(card);
});
