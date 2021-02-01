import React, { Component } from 'react'
import '../layout/Contacts.css'
import Header from '../layout/Header'

export default class Contacts extends Component {
    render() {
        return (
            <div className="resetPage">
                <Header />
                <div className="contactsSection">
                    <h1>Контакты:</h1>
                    <p>Телефон: 8 999 99 99</p>
                </div> 
            </div>
        )
    }
}
