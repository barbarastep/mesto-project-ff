const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

// Удаление карточки
export function deleteCard(cardElement) {
  cardElement.remove();
}

// Лайк карточки
export function toggleCardLike(buttonLike) {
  buttonLike.addEventListener('click', () => {
    buttonLike.classList.toggle('card__like-button_is-active');
  });
}

// Создание карточки
export function createCard(data, handleDelete, handleLike, handleImageClick) {
  const cardElement = cardTemplate.cloneNode(true);
  const imageCard = cardElement.querySelector('.card__image');
  const buttonDeleteCard = cardElement.querySelector('.card__delete-button');
  const titleCard = cardElement.querySelector('.card__title');
  const buttonLikeCard = cardElement.querySelector('.card__like-button');

  titleCard.textContent = data.name;
  imageCard.src = data.link;
  imageCard.alt = data.name;

  buttonDeleteCard.addEventListener('click', () => handleDelete(cardElement));
  handleLike(buttonLikeCard);
  imageCard.addEventListener('click', () => handleImageClick(data));

  return cardElement;
}
