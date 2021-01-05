import React, { Component } from 'react'
import '../layout/ResetPage.css'
import Header from '../layout/Header'

export default class ResetPage extends Component {
    render() {
        return (
            <div className="resetPage">
                <Header />
                <div className="passResetSection">
                    <h1>Восстановление пароля</h1>
                    <form className="resetForm" action="/api/reset" method="POST">
                    <label>Адрес электронной почты:<input id="registerTextInput" type="text" name="email" placeholder="Введите эл.адрес" required onInvalid={(e) => {e.target.setCustomValidity("Это поле является обязательным")}} onInput={(e) => {e.target.setCustomValidity("")}}></input></label>
                    <input id="resetSubmitButton" type="submit" value="Восстановить пароль" />
                    </form>
                </div> 
            </div>
        )
    }
}
