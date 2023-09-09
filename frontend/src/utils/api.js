class Api{
  constructor(options){
    this._options = options;
    this._authorization = this._options.headers.authorization;
    this._url = this._options.baseUrl;
    this._headers = this._options.headers;
  }

  //информация о пользователе на сервере
  async getInfoUser(){    
    const user = await fetch(`${this._options.baseUrl}/users/me`, {
      headers: {
        //authorization: this._authorization,
        'authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    return this._checkResponse(user);
  }  

  //отправка данных при редактировании профиля(editUserInfo)
  async editInfoUser({ name, specialization }){
      const infoUser = await fetch(`${this._options.baseUrl}/users/me`, {
        method: 'PATCH',
        //headers: this._headers,
        headers: {
          // authorization: 'b7798525-3f5b-46f7-bffb-bb7cea590922',
          // authorization: this._authorization,
          'authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          about: specialization,
        })
      })
      return this._checkResponse(infoUser);
  }

  //отправка данных при редактировании фото
  async editInfoAvatar(avatarLink){  
    const avatar = await fetch(`${this._options.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        // this._headers
        'authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatarLink.avatar
      })
    })
    return this._checkResponse(avatar);
  }


  //информация о имеющихся карточках на сервере
  async getInitialCards() {    
    const intialCards = await fetch(`${this._options.baseUrl}/cards`, {
      headers: {
        //authorization: this._authorization,
        'authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
      return this._checkResponse(intialCards);        
    
  }

  //добавление новой карточки на сервер
  async getAddNewCard(name, link) {
    const infoNewCard = await fetch(`${this._options.baseUrl}/cards`, {
      method: 'POST',
      headers: {
        // this._headers
        'authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
    return this._checkResponse(infoNewCard);
  }  

  //удаление новой карточки с сервера
  async deleteCard(id) {
    const delCard = await fetch(`${this._options.baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        // authorization: this._authorization,
        'authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
    })
    return this._checkResponse(delCard);
  }

  // поставить лайк
  async putLike(id) {
    const putLikeCard = await fetch(`${this._options.baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: {
        // authorization: this._authorization,
        'authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
    })
    return this._checkResponse(putLikeCard);
  }

  // удаление лайка
  async deleteLike(id) {
    const deleteLikeCard = await fetch(`${this._options.baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: {
        // authorization: this._authorization,
        'authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
    })
    return this._checkResponse(deleteLikeCard);
  }

  changeLikeCardStatus(id, isLiked){
    return isLiked ? this.putLike(id) : this.deleteLike(id)
  }
  
  /*----Проверка ответа----*/
  _checkResponse(res){
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

/*-----*/
}

/*----------Создание экземпляра класса Api --------*/
const api = new Api({
  // baseUrl: 'https://alexmah15backend.nomoredomainsicu.ru',
  // baseUrl: 'http://localhost:3000',
  baseUrl: 'http://localhost:3001',
  headers: {
    // 'authorization': `Bearer ${localStorage.getItem('jwt')}`,
    //authorization: 'b7798525-3f5b-46f7-bffb-bb7cea590922',
    'Content-Type': 'application/json'
  }
});

export default api;
