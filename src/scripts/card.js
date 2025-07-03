// Удаление карточки
export function deleteCard(element) {
  element.remove();
}

// Лайк карточки
export function likeCard(button) {
  button.addEventListener('click', () => {
    button.classList.toggle('card__like-button_is-active');
  });
}

// Создание карточки
export function createCard(data, onDelete, onLike, onImageClick) {
  const card = document.querySelector('#card-template').content.querySelector('.card').cloneNode(true);
  const image = card.querySelector('.card__image');
  const deleteButton = card.querySelector('.card__delete-button');
  const title = card.querySelector('.card__title');
  const likeButton = card.querySelector('.card__like-button');

  title.textContent = data.name;
  image.src = data.link;
  image.alt = data.name;

  deleteButton.addEventListener('click', () => onDelete(card));
  onLike(likeButton);
  image.addEventListener('click', () => onImageClick(data));

  return card;
}
