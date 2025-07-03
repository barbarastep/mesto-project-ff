import '../pages/index.css';
import { initialCards, createCard, deleteCard, likeCard } from './cards.js';
import { openPopup, closePopup, setOverlayClose } from './modal.js';

const cardsContainer = document.querySelector('.places__list');
const cardImagePopup = document.querySelector('.popup_type_image');
const popupImage = cardImagePopup.querySelector('.popup__image');
const popupCaption = cardImagePopup.querySelector('.popup__caption');

// Открытие попапа с изображением
function openImagePopup(data) {
  popupImage.src = data.link;
  popupImage.alt = data.name;
  popupCaption.textContent = data.name;
  openPopup(cardImagePopup, handleEscClose);
}

// Добавление начальных карточек
initialCards.forEach(data => {
  const card = createCard(data, deleteCard, likeCard, openImagePopup);
  cardsContainer.appendChild(card);
});

// Попапы
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');

const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');
const nameInput = formElement.elements.name;
const jobInput = formElement.elements.description;

// Открытие попапа редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closePopup(editPopup, handleEscClose);
}

formElement.addEventListener('submit', handleFormSubmit);

// Закрытие попапа через Esc
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closePopup(openedPopup, handleEscClose);
    }
  }
}

document.querySelector('.profile__edit-button').addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openPopup(editPopup, handleEscClose);
});

document.querySelector('.profile__add-button').addEventListener('click', () => {
  openPopup(addPopup, handleEscClose);
});

document.querySelector('.popup_type_image .popup__close').addEventListener('click', () => {
  closePopup(cardImagePopup, handleEscClose);
});
document.querySelector('.popup_type_edit .popup__close').addEventListener('click', () => {
  closePopup(editPopup, handleEscClose);
});
document.querySelector('.popup_type_new-card .popup__close').addEventListener('click', () => {
  closePopup(addPopup, handleEscClose);
});

setOverlayClose(editPopup, () => closePopup(editPopup, handleEscClose));
setOverlayClose(addPopup, () => closePopup(addPopup, handleEscClose));
setOverlayClose(cardImagePopup, () => closePopup(cardImagePopup, handleEscClose));

// Добавление новой карточки
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInputNewCard = newCardForm.elements['place-name'];
const linkInputNewCard = newCardForm.elements.link;

function addNewCard(evt) {
  evt.preventDefault();
  const name = nameInputNewCard.value;
  const link = linkInputNewCard.value;
  const newCard = createCard({ name, link }, deleteCard, likeCard, openImagePopup);
  cardsContainer.prepend(newCard);
  closePopup(addPopup, handleEscClose);
  newCardForm.reset();
}

newCardForm.addEventListener('submit', addNewCard);
