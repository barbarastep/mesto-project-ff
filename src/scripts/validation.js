const getErrorElement = (formElement, inputElement) =>
  formElement.querySelector(`.${inputElement.id}-error`);

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = getErrorElement(formElement, inputElement);
  inputElement.classList.add('popup__input_type_error');
  inputElement.classList.add('popup__input_no-margin');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__input-error_active');
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = getErrorElement(formElement, inputElement);
  inputElement.classList.remove('popup__input_type_error');
  inputElement.classList.remove('popup__input_no-margin');
  errorElement.classList.remove('popup__input-error_active');
  errorElement.textContent = '';
};

const isValid = (formElement, inputElement) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add('popup__button-inactive');
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove('popup__button-inactive');
  }
};

const getFormElements = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');
  return { inputList, buttonElement };
};

const setEventListeners = (formElement) => {
  const { inputList, buttonElement } = getFormElements(formElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });

  toggleButtonState(inputList, buttonElement);
};

export function clearValidation(formElement) {
  const { inputList, buttonElement } = getFormElements(formElement);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
  });

  toggleButtonState(inputList, buttonElement);
}

export function enableValidation() {
  const formList = Array.from(document.querySelectorAll('.popup__form'));
  formList.forEach((formElement) => setEventListeners(formElement));
};
