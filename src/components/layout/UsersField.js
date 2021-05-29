import React, { Component } from 'react'
import ChatField from '../layout/ChatField'
import { v4 as uuidv4 } from 'uuid'

export default class UsersField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: this.props.isLoggedIn || false,
            userUuid: this.props.uuid || null,
            usersList: [],
            chatField: null,
            newFriend: ''
        }
        this.getUsersList()
      }

      getUsersList = async () => {
        if (this.state.userUuid !== null) {
            const data = {uuid: this.state.userUuid, chatUuid: uuidv4()}
            const request = await fetch('/api/getChatUsersList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const response = await request.json()
            // console.log(response[0])
            if (response[0].chat_uuid === 'nothing') {
                window.location.reload()
            } else {
                this.setState({usersList: response})
            }
        } 
    }
    
    handleFriendAdding = async e => {
        e.preventDefault()
        const data = {friendId: this.state.friendId, userUuid: this.state.userUuid, chatUuid: uuidv4()}
        const request = await fetch('/api/addFriend', {
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
            this.getUsersList()
            this.forceUpdate()
        }
        document.getElementById("addFriendInput").value = ""
    }

    handleClick = (friend__uuid) => {
        this.setState({chatField: friend__uuid})
    }

    render() {
        return (
            <div>
                {this.state.usersList.length ? (
                    <div className="usersFieldBody">
                        {this.state.usersList.map((item) => {
                        return(
                            <div className="userItem" key={item.chat_uuid} onClick={() => this.handleClick(item.friend_uuid)}>
                            {item.friend_avatar ? (
                            <img id="friendAvatar" src={item.friend_avatar} alt=''></img>
                            ): <img id="friendAvatar" src='/images/cat.png' alt=''></img>
                            }
                            <p className="friendName">{item.friend_firstname} {item.friend_lastname}</p>
                            {this.state.chatField === item.friend_uuid ? (
                                <ChatField isLoggedIn={this.state.isLoggedIn} user_uuid={this.state.userUuid} friend_uuid={this.state.chatField}></ChatField>
                                ) : null 
                            }
                            </div>
                        );
                        })}
                        <form onSubmit={this.handleFriendAdding}>
                        <input id="addFriendInput" type="text" name="friend" placeholder="Введите id друга" onChange={(e) => this.setState({friendId: e.target.value})} required onInvalid={(e) => {e.target.setCustomValidity("Необходим ввод id друга")}}></input>
                        <button type="submit" id="addFriendButton">Добавить</button>
                        </form>
                    </div>
                ) : null
                }
            </div>
        )
    }
}