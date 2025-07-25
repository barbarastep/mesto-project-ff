import { toggleCardLike, deleteCard } from './api.js';

const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

// Удаляет карточку с сервера и из DOM
export function handleDelete(cardElement, cardId) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error(`Ошибка при удалении карточки: ${err}`);
      alert('Не удалось удалить карточку. Попробуйте позже.');
    });
};

// Генерирует DOM-элемент карточки
export function createCard(data, handleDelete, handleImageClick, currentUserId) {
  const cardElement = cardTemplate.cloneNode(true);
  const imageCard = cardElement.querySelector('.card__image');
  const buttonDeleteCard = cardElement.querySelector('.card__delete-button');
  const titleCard = cardElement.querySelector('.card__title');
  const buttonLikeCard = cardElement.querySelector('.card__like-button');
  const cardLikeCounter = cardElement.querySelector('.card__like-counter');

  // Устанавливает содержимое карточки
  titleCard.textContent = data.name;
  imageCard.src = data.link;
  imageCard.alt = data.name;
  cardLikeCounter.textContent = data.likes.length;

  // Подсвечивает лайк, если пользователь уже лайкал
  if (data.likes.some(user => user._id === currentUserId)) {
  buttonLikeCard.classList.add('card__like-button_is-active');
  }

  // Удаляет кнопку удаления, если карточка чужая
  if (data.owner._id !== currentUserId) {
  buttonDeleteCard.remove();
  }

  // Обработчик удаления карточки
  buttonDeleteCard.addEventListener('click', () => handleDelete(cardElement, data._id));

  // Обработчик лайка
  buttonLikeCard.addEventListener('click', () => {
    const isLiked = buttonLikeCard.classList.contains('card__like-button_is-active');

    toggleCardLike(data._id, isLiked)
      .then((updatedCard) => {
        cardLikeCounter.textContent = updatedCard.likes.length;
        buttonLikeCard.classList.toggle('card__like-button_is-active');
      })
      .catch((err) => {
        console.error(`Ошибка при лайке карточки: ${err}`);
        alert('Не удалось поставить лайк. Попробуйте позже.');
      });
  });

  // Обработчик клика по изображению
  imageCard.addEventListener('click', () => handleImageClick(data));

  return cardElement;
};
