// Открытие попапа
export function openPopup(popup, onEscClose) {
  popup.classList.add('popup_is-opened', 'popup_is-animated');
  document.addEventListener('keydown', onEscClose);
}

// Закрытие попапа
export function closePopup(popup, onEscClose) {
  popup.classList.remove('popup_is-opened', 'popup_is-animated');
  document.removeEventListener('keydown', onEscClose);
}

// Закрытие попапа через оверлей
export function setOverlayClose(popup, closeFunc) {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeFunc();
    }
  });
}
