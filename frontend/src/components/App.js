import React from "react";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
/*-12 проект-*/
import Login from "./Login";
import Register from "./Register";
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import InfoTooltip from "./InfoTooltip";
import { ProtectedRoute } from "./ProtectedRoute";
import * as auth from '../utils/auth.js';

function App() {
  const [currentUser,  setCurrentUser] = React.useState({});
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    checkToken();
  }, [])

  const checkToken = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt === null){
      return
    }
    auth.checkToken(jwt)
    .then((data) => {
      if(!data) {
        return
      }
      setEmail(data.email);
      setLoggedIn(true);
      navigate(location.pathname);
    })
    .catch((err) => {
      console.error(err)
      setLoggedIn(false)
    })
  }

  function handleUserData(email){
    setEmail(email);
  }

  React.useEffect(() =>{ 
    if (!isLoggedIn){
      return;
    } 
    api.getInfoUser().then(infoUser => {
      setCurrentUser(
        () =>({
          name: infoUser.name,
          about: infoUser.about,
          avatar: infoUser.avatar,
          _id: infoUser._id,
        })
      )
    }).catch(err => console.log(err))
  }, [isLoggedIn])

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    open: false,
    link: '',
    nameImg: ''
  });
  const [isInfoTooltip, setInfoTooltip] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);

  /*---сохранение - сохранить---*/

  const [updateUserIsLoading, setUpdateUserIsLoading] = React.useState(false);
  const [updateAvatarIsLoading, setUpdateAvatarIsLoading] = React.useState(false);
  const [addPlaceSubmitIsLoading, setAddPlaceSubmitIsLoading] = React.useState(false);

  /*---------------------------*/

  function handleClickEditProfile(){
    setIsEditProfilePopupOpen(true);
  }

  function handleClickEditAvatar(){
    setIsEditAvatarPopupOpen(true)
  }

  function handleClickAddPlace(){
    setIsAddPlacePopupOpen(true);
  }

  function handleInfoTooltip(){
    setInfoTooltip(true);
  }

  function handleRegistered(){
    setRegistered(true)
  }

  function closeAllPopups(){
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({
        open: false,
        link: '',
        nameImg: ''
    });
    setInfoTooltip(false);    
    setRegistered(false);
  }

  /*---------cards-------------*/
  const [cards, setCards] = React.useState([]);

  React.useEffect(() =>{
    if (!isLoggedIn){
      return;
    } 
    api.getInitialCards().then(infoCards => {
      setCards(infoCards)
    }).catch(err => console.log(err))
  }, [isLoggedIn])

  /*------------ лайки ----------*/
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch(err => console.log(err)); 
  }
  /*---------- удаление карточки ------------*/
  function handleCardDelete(card) { 
    api.deleteCard(card._id).then((newCard) => {  
      setCards((state) => state.filter((c) => c._id !== card._id ));
    }).catch(err => console.log(err));
  }
  /*---Редактирование профиля---*/
  function handleUpdateUser({ name, specialization }){
    setUpdateUserIsLoading(true)
    api.editInfoUser({ name, specialization })
      .then((info) => {
        setCurrentUser(info)
        closeAllPopups()
        setUpdateUserIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setUpdateUserIsLoading(false)
      });
  }
  /*---Редактирование аватара---*/
  function handleUpdateAvatar(avatarLink){
    setUpdateAvatarIsLoading(true)
    api.editInfoAvatar(avatarLink)
      .then((info) => {
        setCurrentUser(info)
        closeAllPopups()
        setUpdateAvatarIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setUpdateAvatarIsLoading(false)
      });    
  }
  /*---Создание новой карточки---*/
  function handleAddPlaceSubmit(name, link){
    setAddPlaceSubmitIsLoading(true)
    api.getAddNewCard(name, link)
      .then((infoCard) => {
        setCards([infoCard, ...cards])     
        closeAllPopups()
        setAddPlaceSubmitIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setAddPlaceSubmitIsLoading(false)
      });   
  }

  function handelLogin(email){
    setLoggedIn(true);
    handleUserData(email);
  }

  function signUserOut(){
    localStorage.removeItem("jwt");
    handleUserData("");
    setLoggedIn(false);
  }

  /*----------------------*/
  return (
    <CurrentUserContext.Provider value={currentUser}>  
      <div className="root">
        <div className="page">
          <Header 
            userData={email}
            signUserOut={signUserOut}
          />
          
          <Routes>
            <Route path="/main" element={
              <ProtectedRoute 
                element={Main}
                isLoggedIn={ isLoggedIn }
                onEditProfile = {handleClickEditProfile}
                onEditAvatar = {handleClickEditAvatar}
                onAddPlace = {handleClickAddPlace}
                onCardClick = {setSelectedCard}
                onCardLike = {handleCardLike}
                onCardDelete = {handleCardDelete}
                cards = {cards} 
              />             
            }/>
            <Route path="/sign-up" element={<Register openInfoTooltip = {handleInfoTooltip} setIsSuccessRegistration = {handleRegistered}/>}/>
            <Route path="/sign-in" element={<Login handelLogin={handelLogin} />}/>
            <Route path="*" element={isLoggedIn ? <Navigate to="/main" /> : <Navigate to="/sign-in" />} />
          </Routes>
        
          <Footer />
        </div>
        
        {/*---окно подтверждения регистрации---*/}
        <InfoTooltip 
          onClose={closeAllPopups}
          isOpen={isInfoTooltip}
          registered={registered}
        />

        {/*---Окно редактирования профиля---*/}
        <EditProfilePopup 
          isOpen={isEditProfilePopupOpen} 
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading = {updateUserIsLoading}
        />

        {/*---Окно редактирования аватара---*/}
        <EditAvatarPopup 
          isOpen={isEditAvatarPopupOpen} 
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading = {updateAvatarIsLoading}
        />
        {/*---Окно добавления новой карточки---*/}
        <AddPlacePopup 
          isOpen={isAddPlacePopupOpen} 
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          isLoading = {addPlaceSubmitIsLoading}
        />        
        {/*----------------------------*/}

        <ImagePopup 
          name = "open-image"
          card = {selectedCard}
          onClose = {closeAllPopups}        
        />

      </div>
      </CurrentUserContext.Provider>
  );
}

export default App;
