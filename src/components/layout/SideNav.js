import React, { Component } from 'react'
import '../layout/SideNav.css'
import Cookies from 'js-cookie'
export default class SideNav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: this.props.userId || '0',
            userRole: this.props.role || 'user',
            image: this.props.img || '/images/cat.png'
        }
      }

    handleLogout = () => {
        Cookies.remove('user_id')
        Cookies.remove('user_email')
        Cookies.remove('user_date')
        window.location.reload()
    }

    render() {
        return (
                <nav className="sideNav">
                        <a href="/course/profile"><img id="profilePic" src={this.state.image} alt=""></img></a>
                        <ul className="category">
                            <li> 
                                <a href="/course/profile"><img id="categoryPic" src="/images/home.png" alt=""></img></a>
                                <div className="subCategory">
                                    <h3>Главная</h3>
                                    <p><a href="/course/profile">Профиль</a></p>
                                    <p><button id="sideNavButton" onClick={this.handleLogout}>Выйти</button></p>
                                </div>
                            </li>
                            <li> 
                                <a href="/course/schedule"><img id="categoryPic" src="/images/graph.png" alt=""></img></a>
                                <div className="subCategory">
                                    <h3>Обучение</h3>
                                    <p><a href="/course/schedule">Расписание</a></p>
                                    <p><a href="/course/lectures">Видеолекции</a></p>
                                    <p><a href="/course/tests">Тесты</a></p>
                                </div>
                            </li>
                            {this.state.userRole === 'admin' || this.state.userRole === "manager" ?
                            <li> 
                                <a href="/course/tasks"><img id="categoryPic" src="/images/tasks.png" alt=""></img></a>
                                <div className="subCategory">
                                    <h3>Задачи</h3>
                                    <p><a href="/course/tasks">Список задач</a></p>
                                </div>
                            </li>
                            : null
                            }
                            {this.state.userRole === 'admin' || this.state.userRole === "manager" ?
                            <li> 
                                <a href="/course/sales"><img id="categoryPic" src="/images/purchases.png" alt=""></img></a>
                                <div className="subCategory">
                                    <h3>Покупки</h3>
                                    <p><a href="/course/sales">Покупки</a></p>
                                </div>
                            </li>
                            : null
                            }
                            <li> 
                                <a href="/course/chat"><img id="categoryPic" src="/images/chat.png" alt=""></img></a>
                                <div className="subCategory">
                                    <h3>Чат</h3>
                                    <p><a href="/course/chat">Чат курса</a></p>
                                    <p><a href="/course/support">Обратная связь</a></p>
                                </div>
                            </li>
                        </ul>
                    </nav>
        )
    }
}
