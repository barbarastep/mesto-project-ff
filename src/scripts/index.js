import '../pages/index.css';
import { getUserInfo, getCards, updateUserInfo, addCard, updateAvatar } from './api.js';
import { createCard, handleDelete } from './card.js';
import { openPopup, closePopup, setPopupOverlayListener, handlePopupEscClose } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';

//
// Переменные
//

const cardList = document.querySelector('.places__list');

// Элементы профиля
const textProfileName = document.querySelector('.profile__title');
const textProfileJob = document.querySelector('.profile__description');

// Попап редактирования профиля
const popupProfile = document.querySelector('.popup_type_edit');
const formProfile = document.querySelector('.popup__form[name="edit-profile"]');
const inputProfileName = formProfile.elements.name;
const inputProfileJob = formProfile.elements.description;

// Попап обновления аватара
const popupAvatar = document.querySelector('.popup_type_update-avatar');
const profileAvatar = document.querySelector('.profile__image');
const formAvatar = document.querySelector('.popup__form[name="update-avatar"]');
const inputAvatarLink = formAvatar.elements.avatar;

// Попап добавления новой карточки
const popupAddNewCard = document.querySelector('.popup_type_new-card');
const formAddNewCard = document.querySelector('.popup__form[name="new-place"]');
const inputCardName = formAddNewCard.elements['place-name'];
const inputCardLink = formAddNewCard.elements.link;

// Попап с картинкой
const popupFullImage = document.querySelector('.popup_type_image');
const imagePopupFullImage = popupFullImage.querySelector('.popup__image');
const captionPopupFullImage = popupFullImage.querySelector('.popup__caption');

const popups = [
  { selector: '.popup_type_edit .popup__close', popup: popupProfile },
  { selector: '.popup_type_new-card .popup__close', popup: popupAddNewCard },
  { selector: '.popup_type_image .popup__close', popup: popupFullImage },
  { selector: '.popup_type_update-avatar .popup__close', popup: popupAvatar }
];

let currentUserId;

// Изменение текта кнопки при загрузке
// const submitButton = formAddNewCard.querySelector('.popup__button');
// const originalText = submitButton.textContent;

//
// Функции
//

// Изменение текта кнопки при загрузке
function getSubmitButtonInfo(formElement) {
  const button = formElement.querySelector('.popup__button');
  return {
    button,
    originalText: button.textContent
  };
}

// Обработчик клика на изображение карточки
function handleCardImageClick(data) {
  imagePopupFullImage.src = data.link;
  imagePopupFullImage.alt = data.name;
  captionPopupFullImage.textContent = data.name;
  openPopup(popupFullImage, handlePopupEscClose);
};

// Обработчик заполнения формы профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const { button: submitButton, originalText } = getSubmitButtonInfo(formProfile);
  toggleButtonText(submitButton, 'Сохранение...', originalText);

  updateUserInfo(inputProfileName.value, inputProfileJob.value)
    .then((user) => {
      textProfileName.textContent = user.name;
      textProfileJob.textContent = user.about;
      closePopup(popupProfile, handlePopupEscClose);
    })
    .catch((err) => console.log('Ошибка:', err))
    .finally(() => {
      toggleButtonText(submitButton, 'Сохранение...', originalText);
    })
};

// Обработчик обновления аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const { button: submitButton, originalText } = getSubmitButtonInfo(formAvatar);
  toggleButtonText(submitButton, 'Сохранение...', originalText);

  const avatarUrl = inputAvatarLink.value;

  updateAvatar(avatarUrl)
    .then((user) => {
      profileAvatar.style.backgroundImage = `url('${user.avatar}')`;
      closePopup(popupAvatar, handlePopupEscClose);
    })
    .catch((err) => console.log('Ошибка при обновлении аватара:', err))
    .finally(() => {
      toggleButtonText(submitButton, 'Сохранение...', originalText);
    })
};

// Обработчик добавления новой карточки
function handleAddNewCardSubmit(evt) {
  evt.preventDefault();

  const { button: submitButton, originalText } = getSubmitButtonInfo(formAddNewCard);
  toggleButtonText(submitButton, 'Сохранение...', originalText);

  const name = inputCardName.value;
  const link = inputCardLink.value;

  addCard(name, link)
    .then((cardData) => {
      const newCard = createCard(cardData, handleDelete, handleCardImageClick, currentUserId);
      cardList.prepend(newCard);
      closePopup(popupAddNewCard, handlePopupEscClose);
      formAddNewCard.reset();
    })
    .catch((err) => console.log('Ошибка при добавлении карточки:', err))
    .finally(() => {
      toggleButtonText(submitButton, 'Сохранение...', originalText);
    });
}

// Обработчик изменения текста на кнопке при загрузке
function toggleButtonText(button, loadingText, originalText = null) {
  if (!originalText) {
    originalText = button.textContent;
  }
  if (button.textContent === originalText) {
    button.textContent = loadingText;
  } else {
    button.textContent = originalText;
  }
  return originalText;
}

// Слушатели событий
formProfile.addEventListener('submit', handleProfileFormSubmit);
formAddNewCard.addEventListener('submit', handleAddNewCardSubmit);
formAvatar.addEventListener('submit', handleAvatarFormSubmit);

//
// Кнопки
//

// Кнопка редактирования профиля
document.querySelector('.profile__edit-button').addEventListener('click', () => {
  formProfile.reset();
  clearValidation(formProfile);
  inputProfileName.value = textProfileName.textContent;
  inputProfileJob.value = textProfileJob.textContent;
  openPopup(popupProfile, handlePopupEscClose);
});

// Кнопка обновления аватара
profileAvatar.addEventListener('click', () => {
  formAvatar.reset();
  clearValidation(formAvatar);
  openPopup(popupAvatar, handlePopupEscClose);
});

// Кнопка добавления новой карточки
document.querySelector('.profile__add-button').addEventListener('click', () => {
  formAddNewCard.reset();
  clearValidation(formAddNewCard);
  openPopup(popupAddNewCard, handlePopupEscClose);
});

// Закрытие попапов
popups.forEach(({ selector, popup }) => {
  document.querySelector(selector).addEventListener('click', () => closePopup(popup, handlePopupEscClose));
  setPopupOverlayListener(popup, () => closePopup(popup, handlePopupEscClose));
});

// Валидация формы
enableValidation();

// Получение информации о пользователе и карточках
Promise.all([getUserInfo(), getCards()])
  .then(([userData, cards]) => {
    textProfileName.textContent = userData.name;
    textProfileJob.textContent = userData.about;
    profileAvatar.src = userData.avatar;

    profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;

    currentUserId = userData._id;

    cards.forEach((data) => {
      const card = createCard(data, handleDelete, handleCardImageClick, currentUserId);
      cardList.appendChild(card);
    });
  })
  .catch((err) => {
    console.log('Ошибка при загрузке данных:', err);
  });
