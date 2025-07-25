// Получает элемент ошибки по id инпута
const getErrorElement = (formElement, inputElement) =>
  formElement.querySelector(`.${inputElement.id}-error`);

// Показывает сообщение об ошибке
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = getErrorElement(formElement, inputElement);
  inputElement.classList.add(...config.inputErrorClass.split(' '));
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

// Скрывает сообщение об ошибке
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = getErrorElement(formElement, inputElement);
  inputElement.classList.remove(...config.inputErrorClass.split(' '));
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
};

// Проверяет валидность инпута и показывает/скрывает ошибку
const isValid = (formElement, inputElement, config) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Проверяет, есть ли невалидные инпуты в списке
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Переключает состояния кнопки отправки формы
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, config);
  } else {
    enableSubmitButton(buttonElement, config);
  }
};

// Деактивирует кнопку отправки
const disableSubmitButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

// Активирует кнопку отправки
const enableSubmitButton = (buttonElement, config) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
};

// Получает список инпутов и кнопку из формы
const getFormElements = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  return { inputList, buttonElement };
};

// Устанавливает слушатели на все инпуты формы
const setEventListeners = (formElement, config) => {
  const { inputList, buttonElement } = getFormElements(formElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });

  toggleButtonState(inputList, buttonElement, config);
};

// Сбрасывает ошибки и стили при открытии формы
export function clearValidation(formElement, config) {
  const { inputList, buttonElement } = getFormElements(formElement, config);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });
};

// Включает валидацию для всех форм на странице
export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => setEventListeners(formElement, config));
};
