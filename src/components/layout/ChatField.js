import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
export default class ChatField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: this.props.isLoggedIn || false,
            userUuid: this.props.user_uuid || null,
            friendUuid: this.props.friend_uuid || null,
            messagesList: [],
            content: '',
        }
        this.getMessagesList()
      }

      getMessagesList = async () => {
        if (this.state.friendUuid !== null) {
            const data = {friendUuid: this.state.friendUuid, userUuid: this.state.userUuid}
            const request = await fetch('/api/getChatMessagesList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const response = await request.json()
            if (response[0].message_uuid === 'nothing') {
                this.setState({messagesList: [{content: 'Сообщений нет', message_uuid: uuidv4(), }]})
            } else {
                this.setState({messagesList: response})
            }
        } else this.props.history.push('/')
    }

    handleMessageSending = async e => {
        e.preventDefault()
        const data = {content: this.state.content, userUuid: this.state.userUuid, friendUuid: this.state.friendUuid, messageUuid: uuidv4(), chatUuid: uuidv4()}
        const request = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.status
        console.log(response)
        if (response === 200) {
            this.getMessagesList()
            this.forceUpdate()
        }
        document.getElementById("messageInput").value = ""
    }

    render() {
        return (
            <div>
                {this.state.messagesList.length ? (
                    <div className="chatFieldBody">
                        {this.state.messagesList.map((item) => {
                        return(
                            <div id="messageItem" key={item.message_uuid}>
                            <p id="chatMessage">{item.content}</p>
                            </div>
                        );
                        })}
                        <form onSubmit={this.handleMessageSending}>
                        <input id="messageInput" type="text" name="friend" placeholder="Введите сообщение" onChange={(e) => this.setState({content: e.target.value})} required onInvalid={(e) => {e.target.setCustomValidity("Необходим ввод сообщения")}}></input>
                        <button type="submit" id="messageSendingButton">Отправить</button>
                        </form>
                    </div>
                ) : null
                }
            </div>
        )
    }
}
