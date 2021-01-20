import React, { Component } from 'react'
import '../layout/Tasks.css'
import SideNav from '../layout/SideNav'
import Cookies from 'js-cookie'
import ContentHead from '../layout/ContentHead'
import ProfilePopup from '../layout/ProfilePopup'


export class Tasks extends Component {
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
            tasks: [],
            showProfilePopup: false,
            clientUuid: ''
        }
        this.getUser();
      }

      toggleProfilePopup() {
        this.setState({
            showProfilePopup: !this.state.showProfilePopup
        });
        this.toggleProfilePopup=this.toggleProfilePopup.bind(this)
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
                if ( (userEmail === response[0].email && userDate === response[0].date && response[0].role === 'manager') || response[0].role === 'admin') {
                    this.setState({
                        role: response[0].role || '',
                        userGroup: response[0].usergroup || '',
                        image: response[0].image || '',
                        id: response[0].uuid || 0,
                        isLoggedIn: true,
                    })
                } else this.props.history.push('/')
            }
        } else {
            this.props.history.push('/')
        }
        this.getTasks()
      }

      getTasks = async () => {
        const data = {id: this.state.id}
        const request = await fetch('/api/getTasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        if (response.length === 0) {
            console.log("cant find tasks")
        } else {
            this.setState({ tasks: response })
        }
      }

      handleClick = (uuid) => {
          this.setState({clientUuid: uuid, showProfilePopup: true})
      }

    render() {
        return (
            <div className="CourseTasksPage">
                {this.state.isLoggedIn ? (
                    <div>
                        <SideNav userId={this.state.id} img={this.state.image} role={this.state.role}/>
                        <ContentHead text="Задачи"/>
                        {this.state.showProfilePopup ? 
                        <ProfilePopup
                            uuid={this.state.clientUuid}
                            closePopup={this.toggleProfilePopup.bind(this)}
                        />
                        : null
                        } 
                        <div className="tasksSection">
                            <table>
                                <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Поставлена</td>
                                    <td>Клиент</td>
                                    <td>Менеджер</td>
                                    <td>Суть задачи</td>
                                    <td>Статус</td>
                                    <td>Отложена до</td>
                                    <td>Завершить до</td>
                                </tr>
                                </thead>
                                    {this.state.tasks.length ? (
                                        <tbody>
                                            {this.state.tasks.map((item) => {
                                                return (
                                                    <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.setdate}</td>
                                                    <td onClick={() => this.handleClick(item.clientuuid)}>{item.client}</td>
                                                    <td>{item.manager}</td>
                                                    <td>{item.purpose}</td>
                                                    <td>{item.status}</td>
                                                    <td>{item.postponed}</td>
                                                    <td>{item.enduntil}</td>
                                                    </tr>                                   
                                                );
                                            })}
                                        </tbody>
                                    ) : null
                                    }
                            </table>
                        </div> 
                    </div>
                ) : null
                }
            </div>
        )
    }
}

export default Tasks
