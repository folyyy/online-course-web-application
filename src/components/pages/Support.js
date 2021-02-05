import React, { Component } from 'react'
import '../layout/Support.css'
import SideNav from '../layout/SideNav'
import Cookies from 'js-cookie'
import ContentHead from '../layout/ContentHead'
import Popup from '../layout/Popup'

export default class Support extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: '',
            userGroup: '',
            image: '',
            id: 0,
            isLoggedIn: false,
            email: Cookies.get('user_email') || null,
            message: '',
            showSupportPopup: false,
            popupText: '',
        }
        this.getUser();
      }

      toggleSupportPopup() {
        this.setState({
          showSupportPopup: !this.state.showSupportPopup
        });
        this.toggleSupportPopup=this.toggleSupportPopup.bind(this)
    }

      getUser = async () => {
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
                    this.setState({
                        role: response[0].role || '',
                        userGroup: response[0].usergroup || '',
                        image: response[0].image || '',
                        id: userId || 0,
                        isLoggedIn: true,
                    })
                } else this.props.history.push('/')
            }
        } else {
            this.props.history.push('/')
        }
      }

      sendTicket = (event) => {
        let response;
        var ticket = {
            email: this.state.email,
            message: this.state.message
        }
        fetch('/api/sendSupportTicket', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(ticket)
        })
        .then(res => response = res.status)
        .then(() => {
          if (response === 200)
            this.setState({showSupportPopup: true, popupText: "Заявка успешно отправлена!"})
            else this.setState({showSupportPopup: true, popupText: "Что-то пошло не так. Заявка не отправлена."})
        })
        event.preventDefault()
      }

    render() {
        return (
            <div className="CourseSupportPage">
                {this.state.isLoggedIn ? (
                    <div>
                        <SideNav userId={this.state.id} img={this.state.image} role={this.state.role}/>
                        <ContentHead text="Обратная связь"/>
                        {this.state.showSupportPopup ? 
                        <Popup
                            text={this.state.popupText}
                            closePopup={this.toggleSupportPopup.bind(this)}
                        />
                        : null
                        } 
                        <div className="supportSection">
                            <form className="supportTicketForm" onSubmit={this.sendTicket}>
                            <input id="userEmail" type="text" name="email" defaultValue={this.state.email} hidden />
                            <input id="supportTicketTextInput" type="text" name="message" placeholder="Введите сообщение..." required onChange={(e) => this.setState({message: e.target.value})} onInvalid={(e) => {e.target.setCustomValidity("Это поле является обязательным")}} onInput={(e) => {e.target.setCustomValidity("")}}></input>
                            <br/><button id="supportTicketButton">Отправить </button>
                            </form>
                        </div> 
                    </div>
                ) : null
                }
            </div>
        )
    }
}
