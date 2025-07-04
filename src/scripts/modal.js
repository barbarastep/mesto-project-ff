// Открытие попапа
export function openPopup(popupElement, onEscClose) {
  popupElement.classList.add('popup_is-opened', 'popup_is-animated');
  document.addEventListener('keydown', onEscClose);
}

// Закрытие попапа
export function closePopup(popupElement, onEscClose) {
  popupElement.classList.remove('popup_is-opened', 'popup_is-animated');
  document.removeEventListener('keydown', onEscClose);
}

// Закрытие попапа через оверлей
export function setPopupOverlayListener(popupElement, closeHandler) {
  popupElement.addEventListener('click', (evt) => {
    if (evt.target === popupElement) {
      closeHandler();
    }
  });
}

// Закрытие попапа через Esc
export function handlePopupEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closePopup(openedPopup, handlePopupEscClose);
    }
  }
}
