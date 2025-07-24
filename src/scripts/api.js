const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-42',
  headers: {
    authorization: '16b53f80-e409-4aae-a4c3-5be8c170b903',
    'Content-Type': 'application/json'
  }
};

// Обработка ответа
const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Загрузка информации о пользователе
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(checkResponse);
};

// Загрузка карточек с сервера
export const getCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(checkResponse);
};

// Редактирование профиля
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(checkResponse);
};

// Добавление новой карточки
export const addCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  }).then(checkResponse);
};

// Лайк карточки
export const toggleCardLike = (cardId, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers: config.headers
  }).then(checkResponse);
};

// Удаление карточки
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
}

// Обновление аватара пользователя
export const updateAvatar = (avatarUrl) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(checkResponse);
}
