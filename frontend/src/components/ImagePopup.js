import React from "react";

function ImagePopup(props) {
  return (
    <section className={`popup popup_${props.name} ${props.card.open ? `popup_opened` : ""}`}>
      <div className="popup__container-image">
        <img src={props.card.link} alt={props.card.nameImg} className="popup__image"/>
        <h2 className="popup__name-image">{props.card.nameImg}</h2>
        <button onClick = {props.onClose} type="button" className="popup__close-btn popup__close-btn_open-image"/>
      </div>
    </section>
  )
}

export default ImagePopup;