import React, { Component } from 'react'
import '../layout/Home.css'
import Header from '../layout/Header'
import Popup from '../layout/Popup'
import Cookies from 'js-cookie'
class Home extends Component {
  constructor(props) {
    super(props)
    this.checkIfLoggedIn()
    this.state = {
        email: "",
        password: "",
        showIncorrectPopup: false
    }
    this.handleSubmit=this.handleSubmit.bind(this)
  }

  toggleIncorrectPopup = () => {
    this.setState({
      showIncorrectPopup: !this.state.showIncorrectPopup
    });
    this.toggleIncorrectPopup=this.toggleIncorrectPopup.bind(this)
  }

  checkIfLoggedIn = async () => {
    let userId = Cookies.get('user_id') || 0;
    let userEmail = Cookies.get('user_email') || null;
    let userDate = Cookies.get('user_date') || null;
    if (userId !== 0) {
      const data = {id: userId, email: userEmail}
      const request = await fetch('/api/getUser', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(data)
      })
      const response = await request.json()
      if (response.length === 0) {
          console.log("cant find user")
          this.props.history.push('/')
      } else {
          if (userEmail === response[0].email && userDate === response[0].date) {
            this.props.history.push('/course/profile')
          } else this.props.history.push('/')
      }
  } else {
      this.props.history.push('/')
  }
  }

  handleSubmit = (event) => {
    fetch('/api/loginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then(res => res.json())
    .then(result => {
      if (result[0].success === true) {
        Cookies.set('user_id', result[0].id, { expires: new Date(Date.now() + 604800e3) })
        Cookies.set('user_email', result[0].email, { expires: new Date(Date.now() + 604800e3) })
        Cookies.set('user_date', result[0].date, { expires: new Date(Date.now() + 604800e3) })
        this.props.history.push('/course/profile')
      } else {
        this.setState({showIncorrectPopup: true})
      }
    })
    this.setState({
      email: "",
      password: "",
    })
    event.preventDefault()
  }

  render() {
    return (
    <div className="HomePage">
      <Header />
      {this.state.showIncorrectPopup ? 
        <Popup
          text='Неверно указаны Email или пароль!'
          closePopup={this.toggleIncorrectPopup.bind(this)}
        />
        : null
      }   
        <div className="loginSection">
          <a id="registerLink" href="/register">Регистрация</a>
          <h1>Войти</h1>
          <form onSubmit={this.handleSubmit}>
            <input className="textInput" type="email" name="email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} placeholder="Введите эл.адрес" required onInvalid={(e) => {e.target.setCustomValidity("Введите верный email адрес")}} onInput={(e) => {e.target.setCustomValidity("")}}></input>
            <input className="textInput" type="password" name="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="Введите пароль" required onInvalid={(e) => {e.target.setCustomValidity("Это поле является обязательным")}} onInput={(e) => {e.target.setCustomValidity("")}}/>
            <button id="submitButton">Войти</button>
          </form>
          <a id="passResetLink" href="/reset">Восстановить пароль</a><br/><br/>
          <a id="contactsLink" href="/contacts">Обратная связь</a>
        </div>
        <h2>Если вы забыли пароль или не можете войти, следуйте шагам ниже:</h2>
        <ul>
          <li>Нажмите "Восстановить пароль".</li>
          <li>В форме укажите свой e-mail(по которому вы зарегистрированы на портале).</li>
          <li>Нажмите "Отправить на почту".</li>
          <li>На почту Вам придет письмо со ссылкой на вход.</li>
          <li>По ссылке из письма Вы можете перейти в свой личный кабинет.</li>
          <li>В своем профиле можно поменять пароль на любой удобный для Вас.</li>
        </ul>
    </div>
    );
  }
}
export default Home;