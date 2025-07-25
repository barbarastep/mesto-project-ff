// Импорт стилей и модулей
import '../pages/index.css';
import { getUserInfo, getCards, updateUserInfo, addCard, updateAvatar } from './api.js';
import { createCard, handleDelete } from './card.js';
import { openPopup, closePopup, setPopupOverlayListener, handlePopupEscClose } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';

//
// Переменные
//

const cardList = document.querySelector('.places__list'); // Список карточек

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

// Список попапов с кнопками закрытия — для навешивания обработчиков
const popups = [
  { selector: '.popup_type_edit .popup__close', popup: popupProfile },
  { selector: '.popup_type_new-card .popup__close', popup: popupAddNewCard },
  { selector: '.popup_type_image .popup__close', popup: popupFullImage },
  { selector: '.popup_type_update-avatar .popup__close', popup: popupAvatar }
];

let currentUserId; // ID текущего пользователя (нужен для карточек)

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button-inactive',
  inputErrorClass: 'popup__input_type_error popup__input_no-margin',
  errorClass: 'popup__input-error_active'
};

//
// Функции
//

// Возвращает кнопку формы и её изначальный текст
function getSubmitButtonInfo(formElement) {
  const button = formElement.querySelector('.popup__button');
  return {
    button,
    originalText: button.textContent
  };
}

// Открывает попап с картинкой
function handleCardImageClick(data) {
  imagePopupFullImage.src = data.link;
  imagePopupFullImage.alt = data.name;
  captionPopupFullImage.textContent = data.name;
  openPopup(popupFullImage, handlePopupEscClose);
};

// Сабмит формы профиля
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
    .finally(() => {
      toggleButtonText(submitButton, 'Сохранение...', originalText);
    })
};

// Сабмит формы обновления аватара
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
    .finally(() => {
      toggleButtonText(submitButton, 'Сохранение...', originalText);
    })
};

// Сабмит формы добавления новой карточки
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
    .finally(() => {
      toggleButtonText(submitButton, 'Сохранение...', originalText);
    });
}

// Меняет текст кнопки на "Сохранение..." и обратно
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

//
// Слушатели
//

// Сабмиты форм
formProfile.addEventListener('submit', handleProfileFormSubmit);
formAddNewCard.addEventListener('submit', handleAddNewCardSubmit);
formAvatar.addEventListener('submit', handleAvatarFormSubmit);

// Кнопка редактирования профиля
document.querySelector('.profile__edit-button').addEventListener('click', () => {
  formProfile.reset();
  clearValidation(formProfile, validationConfig);
  inputProfileName.value = textProfileName.textContent;
  inputProfileJob.value = textProfileJob.textContent;
  openPopup(popupProfile, handlePopupEscClose);
});

// Кнопка изменения аватара
profileAvatar.addEventListener('click', () => {
  formAvatar.reset();
  clearValidation(formAvatar, validationConfig);
  openPopup(popupAvatar, handlePopupEscClose);
});

// Кнопка добавления новой карточки
document.querySelector('.profile__add-button').addEventListener('click', () => {
  formAddNewCard.reset();
  clearValidation(formAddNewCard, validationConfig);
  openPopup(popupAddNewCard, handlePopupEscClose);
});

// Обработчики закрытия попапов по крестику и оверлею
popups.forEach(({ selector, popup }) => {
  document.querySelector(selector).addEventListener('click', () => closePopup(popup, handlePopupEscClose));
  setPopupOverlayListener(popup, () => closePopup(popup, handlePopupEscClose));
});

// Включение валидации всех форм
enableValidation(validationConfig);

// Получение данных о пользователе и карточках при загрузке страницы
Promise.all([getUserInfo(), getCards()])
  .then(([userData, cards]) => {
    textProfileName.textContent = userData.name;
    textProfileJob.textContent = userData.about;

    profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;

    currentUserId = userData._id;

    cards.forEach((data) => {
      const card = createCard(data, handleDelete, handleCardImageClick, currentUserId);
      cardList.appendChild(card);
    });
  });
