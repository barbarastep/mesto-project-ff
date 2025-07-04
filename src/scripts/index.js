import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, toggleCardLike } from './card.js';
import { openPopup, closePopup, setPopupOverlayListener, handlePopupEscClose } from './modal.js';

// Переменные
const cardList = document.querySelector('.places__list');
const popupFullImage = document.querySelector('.popup_type_image');
const imagePopupFullImage = popupFullImage.querySelector('.popup__image');
const captionPopupFullImage = popupFullImage.querySelector('.popup__caption');

const popupProfile = document.querySelector('.popup_type_edit');
const popupAddNewCard = document.querySelector('.popup_type_new-card');

const formProfile = document.querySelector('.popup__form[name="edit-profile"]');
const textProfileName = document.querySelector('.profile__title');
const textProfileJob = document.querySelector('.profile__description');
const inputProfileName = formProfile.elements.name;
const inputProfileJob = formProfile.elements.description;

const formAddNewCard = document.querySelector('.popup__form[name="new-place"]');
const inputCardName = formAddNewCard.elements['place-name'];
const inputCardLink = formAddNewCard.elements.link;

// Функции
function handleCardImageClick(data) {
  imagePopupFullImage.src = data.link;
  imagePopupFullImage.alt = data.name;
  captionPopupFullImage.textContent = data.name;
  openPopup(popupFullImage, handlePopupEscClose);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  textProfileName.textContent = inputProfileName.value;
  textProfileJob.textContent = inputProfileJob.value;
  closePopup(popupProfile, handlePopupEscClose);
}

function handleAddNewCardSubmit(evt) {
  evt.preventDefault();
  const name = inputCardName.value;
  const link = inputCardLink.value;
  const newCard = createCard({ name, link }, deleteCard, toggleCardLike, handleCardImageClick);
  cardList.prepend(newCard);
  closePopup(popupAddNewCard, handlePopupEscClose);
  formAddNewCard.reset();
}

// Добавление начальных карточек
initialCards.forEach(data => {
  const card = createCard(data, deleteCard, toggleCardLike, handleCardImageClick);
  cardList.appendChild(card);
});

// Обработчики
formProfile.addEventListener('submit', handleProfileFormSubmit);
formAddNewCard.addEventListener('submit', handleAddNewCardSubmit);

document.querySelector('.profile__edit-button').addEventListener('click', () => {
  inputProfileName.value = textProfileName.textContent;
  inputProfileJob.value = textProfileJob.textContent;
  openPopup(popupProfile, handlePopupEscClose);
});

document.querySelector('.profile__add-button').addEventListener('click', () => {
  openPopup(popupAddNewCard, handlePopupEscClose);
});

document.querySelector('.popup_type_image .popup__close').addEventListener('click', () => {
  closePopup(popupFullImage, handlePopupEscClose);
});
document.querySelector('.popup_type_edit .popup__close').addEventListener('click', () => {
  closePopup(popupProfile, handlePopupEscClose);
});
document.querySelector('.popup_type_new-card .popup__close').addEventListener('click', () => {
  closePopup(popupAddNewCard, handlePopupEscClose);
});

setPopupOverlayListener(popupProfile, () => closePopup(popupProfile, handlePopupEscClose));
setPopupOverlayListener(popupAddNewCard, () => closePopup(popupAddNewCard, handlePopupEscClose));
setPopupOverlayListener(popupFullImage, () => closePopup(popupFullImage, handlePopupEscClose));
