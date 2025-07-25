// Открывает попап и вешает слушатель на Escape
export function openPopup(popupElement, onEscClose) {
  popupElement.classList.add('popup_is-opened', 'popup_is-animated');
  document.addEventListener('keydown', onEscClose);
}

// Закрывает попап и снимает слушатель на Escape
export function closePopup(popupElement, onEscClose) {
  popupElement.classList.remove('popup_is-opened', 'popup_is-animated');
  document.removeEventListener('keydown', onEscClose);
}

// Вешает слушатель закрытия попапа по клику на оверлей
export function setPopupOverlayListener(popupElement, closeHandler) {
  popupElement.addEventListener('click', (evt) => {
    if (evt.target === popupElement) {
      closeHandler();
    }
  });
}

// Обработчик Escape — закрывает открытый попап
export function handlePopupEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closePopup(openedPopup, handlePopupEscClose);
    }
  }
}
