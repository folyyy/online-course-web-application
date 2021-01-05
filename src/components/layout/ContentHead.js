import React, { Component } from 'react'
import '../layout/ContentHead.css'
import Cookies from 'js-cookie'
export default class ContentHead extends Component {
    handleLogout = () => {
        Cookies.remove('user_id')
        Cookies.remove('user_email')
        Cookies.remove('user_date')
        window.location.reload()
    }

    render() {
        return (
            <div className="contentHead">
                <h1>{this.props.text}</h1>
                <button onClick={this.handleLogout}>Выйти</button>
            </div>
        )
    }
}
