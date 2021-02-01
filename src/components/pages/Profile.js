import React, { Component } from 'react'
import '../layout/CourseProfile.css'
import SideNav from '../layout/SideNav'
import Cookies from 'js-cookie'
import ContentHead from '../layout/ContentHead'

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.getUser();
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: '',
            country: '',
            city: '',
            date: '',
            role: '',
            userGroup: '',
            image: '',
            id: 0,
            isLoggedIn: false,
            imagePreviewUrl: '',
            file: ''
        }
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
                        email: response[0].email || '',
                        firstName: response[0].firstname || '',
                        lastName: response[0].lastname || '',
                        phoneNumber: response[0].phonenumber || '',
                        dateOfBirth: response[0].dateofbirth || '',
                        country: response[0].country || '',
                        city: response[0].city || '',
                        date: new Date(response[0].date).toLocaleDateString('ru-RU') || '',
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

    handleImageChange = (event) => {
        event.preventDefault();
        if (event.target.files[0].size > 1000000) {
            alert("Файл не должен превышать 1MB")
        } else {
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
          this.setState({
            file: file,
            imagePreviewUrl: reader.result
          });
        }
        reader.readAsDataURL(file)
        }
    }

    handleImageUpload = async () => {
        const data = {imageURL: this.state.imagePreviewUrl, id: this.state.id}
            const request = await fetch('/api/updateUserImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const response = await request.status
            if (response === 404) {
                console.log("could not update image")
            } else {
                window.location.reload()
                console.log("image uploaded")
            }
    }

    handleImageDelete = async () => {
        const data = {id: this.state.id}
            const request = await fetch('/api/deleteUserImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const response = await request.status
            if (response === 404) {
                console.log("could not delete image")
            } else {
                window.location.reload()
                console.log("image deleted")
            }
    }
    
    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
          $imagePreview = (<img id="previewImage" src={imagePreviewUrl} alt='Аватара нет' />);
        } else {
          $imagePreview = (<img id="previewImage" src={this.state.image} alt='Аватара нет' />);
        }
        return (
            <div className="CourseProfilePage">
                {this.state.id !== 0 ?
                    <SideNav userId={this.state.id} img={this.state.image} role={this.state.role}/>
                    : null
                }
                <ContentHead text="Мой профиль"/>
                <div className="contentBody">
                    <div className="userInfo">
                    <p><label htmlFor="email">E-mail:<input id="email" type="email" name="email" value={this.state.email || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="firstname">Имя:<input id="firstname" type="text" name="firstname" value={this.state.firstName || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="lastname">Фамилия:<input id="lastname" type="text" name="lastname" value={this.state.lastName || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="phone">Телефон:<input id="phone" type="tel" name="number" value={this.state.phoneNumber || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="dateOfBirth">Дата рождения:<input id="dateOfBirth" type="text" name="dateOfBirth" value={this.state.dateOfBirth || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="country">Страна:<input id="country" type="text" name="country" value={this.state.country || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="city">Город:<input id="city" type="text" name="city" value={this.state.city || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="dateOfRegister">Дата регистрации:<input id="dateOfRegister" type="text" name="dateOfRegister" value={this.state.date || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="role">Роль:<input id="role" type="text" name="role" value={this.state.role || 'Не указано'} disabled></input></label></p>
                    <p><label htmlFor="group">Группа:<input id="userGroup" type="text" name="userGroup" value={this.state.userGroup || 'Не указано'} disabled></input></label></p>
                    </div>
                    <div className="infoChange">
                        <p><label>Аватар:</label></p>
                        <div className="imgPreview">{$imagePreview}</div>
                        <input className="fileInput" type="file" accept="image/*" onChange={this.handleImageChange}></input><br/>
                        <button className="imageButton" onClick={this.handleImageUpload}>Обновить</button>
                        <button className="imageButton" onClick={this.handleImageDelete}>Удалить</button>
                    </div>
                </div>
            </div>
        )
    }
}
