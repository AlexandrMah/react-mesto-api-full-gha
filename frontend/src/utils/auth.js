// export const BASE_URL = 'https://alexmah15backend.nomoredomainsicu.ru'; 
// export const BASE_URL = 'http://localhost:3000';
export const BASE_URL = 'http://localhost:3001';

export const registers = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({
      email, password
    })
  })
    .then(res => getResponseData(res));
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => getResponseData(res))
}

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'authorization': `Bearer ${localStorage.getItem('jwt')}`,
      "Authorization" : `Bearer ${token}`,
    },
  })
    .then(res => getResponseData(res));
}

/*----Проверка ответа----*/
function getResponseData(res) {
  if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`); 
  }
  return res.json();
} 

/*-----*/