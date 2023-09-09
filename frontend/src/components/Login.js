import React from "react";
import * as auth from '../utils/auth.js';
import { useNavigate } from 'react-router-dom';

function Login({ handelLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    auth.authorize(email, password).then((jwt) => {
      localStorage.setItem("jwt", jwt.token)
      handelLogin(email);
      navigate("/main");
    }).catch((err) => console.error(err))
  };

  return (
    <div className="register">
      <h2 className="register__title">Вход</h2>
      <form onSubmit = {handleSubmit} action="/apply/" method="POST" name="#" className="register__form">
        
      <label className="register__field">
          <input 
          type="email" 
          placeholder="Email" 
          value={email}
          name="email" 
          id="email-input" 
          className="register__element register__element_key_name" 
          required 
          minLength="2" 
          maxLength="30"
          onChange = {evt => setEmail(evt.target.value)}
          />
          <span className="name-input-error popup__input-error"></span>
        </label>
        <label className="register__field">
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password} 
            name="password" 
            id="password-input" 
            className="register__element register__element_key_img" 
            required
            onChange = {evt => setPassword(evt.target.value)}
          />
          <span className="url-input-error popup__input-error"></span>
        </label>

        <button type="submit" className="register__btn">Войти</button>
      </form>      
    </div>
  )
}

export default Login;