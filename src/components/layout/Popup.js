import React, { Component } from 'react'
import '../layout/Popup.css'
export default class Popup extends Component {
    render() {
        return (
            <div className='popup'>
                <div className='popupContent'>
                    <h1>{this.props.text}</h1>
                    <button onClick={this.props.closePopup}>Закрыть</button>
                </div>
            </div>
        )
    }
}
