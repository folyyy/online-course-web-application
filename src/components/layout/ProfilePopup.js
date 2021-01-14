import React, { Component } from 'react'
import '../layout/ProfilePopup.css'

export class ProfilePopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: this.props.uuid || 0,
            email: '',
            firstname: '',
            lastname: '',
            country: '',
            city: '',
            date: '',
            phonenumber: '',
            dateofbirth: '',
            usergroup: '',
            image: ''
        }
        this.getUser()
      }

    getUser = async () => {
        if (this.state.uuid !== 0) {
            const data = {uuid: this.state.uuid}
            const request = await fetch('/api/getUserByUuid', {
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
                this.props.history.push('/course/tasks')
            } else {
                    this.setState({
                        email: response[0].email || '',
                        firstname: response[0].firstname || '',
                        lastname: response[0].lastname || '',
                        country: response[0].country || '',
                        city: response[0].city || '',
                        date: response[0].date || '',
                        phonenumber: response[0].phonenumber || '',
                        dateofbirth: response[0].dateofbirth || '',
                        usergroup: response[0].usergroup || '',
                        image: response[0].image || ''
                    })
            }
        } else {
            this.props.history.push('/course/tasks')
        }
      }

    render() {
        return (
            <div className='profilePopup'>
                {this.state.email ? (
                    <div className='profilePopupContent'>
                        <img src={this.state.image} alt=''></img>
                        <h1>E-mail: {this.state.email}</h1>
                        <h1>Имя: {this.state.firstname}</h1>
                        <h1>Фамилия: {this.state.lastname}</h1>
                        <h1>Дата рождения: {this.state.dateofbirth}</h1>
                        <h1>Страна: {this.state.country}</h1>
                        <h1>Город: {this.state.city}</h1>
                        <h1>Контактный номер: {this.state.phonenumber}</h1>
                        <h1>Дата регистрации: {this.state.date}</h1>
                        <h1>Группа: {this.state.usergroup}</h1>
                        <button onClick={this.props.closePopup}>Закрыть</button>
                    </div>
                ) : (
                    <div className='profilePopupContent'>
                        <h1>Ошибка! Нет данных</h1>
                        <button onClick={this.props.closePopup}>Закрыть</button>
                    </div> 
                )
                }

            </div>
        )
    }
}

export default ProfilePopup
