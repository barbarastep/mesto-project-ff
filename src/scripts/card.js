import { toggleCardLike, deleteCard } from './api.js';

const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

// Удаление карточки
export function handleDelete(cardElement, cardId) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
}

// Создание карточки
export function createCard(data, handleDelete, handleImageClick, currentUserId) {
  const cardElement = cardTemplate.cloneNode(true);
  const imageCard = cardElement.querySelector('.card__image');
  const buttonDeleteCard = cardElement.querySelector('.card__delete-button');
  const titleCard = cardElement.querySelector('.card__title');
  const buttonLikeCard = cardElement.querySelector('.card__like-button');
  const cardLikeCounter = cardElement.querySelector('.card__like-counter');

  titleCard.textContent = data.name;
  imageCard.src = data.link;
  imageCard.alt = data.name;
  cardLikeCounter.textContent = data.likes.length;

  if (data.likes.some(user => user._id === currentUserId)) {
  buttonLikeCard.classList.add('card__like-button_is-active');
  }

  if (data.owner._id !== currentUserId) {
  buttonDeleteCard.remove();
  }

  buttonDeleteCard.addEventListener('click', () => handleDelete(cardElement, data._id));
  buttonLikeCard.addEventListener('click', () => {
    const isLiked = buttonLikeCard.classList.contains('card__like-button_is-active');

    toggleCardLike(data._id, isLiked)
      .then((updatedCard) => {
        cardLikeCounter.textContent = updatedCard.likes.length;
        buttonLikeCard.classList.toggle('card__like-button_is-active');
      })
  });

  imageCard.addEventListener('click', () => handleImageClick(data));

  return cardElement;
}
