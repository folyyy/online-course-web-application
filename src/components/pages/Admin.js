import React, { Component } from 'react'
import '../layout/Admin.css'
import SideNav from '../layout/SideNav'
import Cookies from 'js-cookie'
import ContentHead from '../layout/ContentHead'
import Popup from '../layout/Popup'

export class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: '',
            userGroup: '',
            image: '',
            id: 0,
            isLoggedIn: false,
            email: Cookies.get('user_email') || null,
            showPopup: false,
            popupText: '',
            // Show functions
            showUserEdit: false,
            showAddLectures: false,
            showAddTests: false,
            showAddTasks: false,
            showAddSales: false,
            // Edit User
            clientEmail: '',
            clientRole: '',
            clientGroup: '',
            groupChanged: false,
            roleChanged: false,
            // Add Lectures
            lectureUrl: '',
            lectureName: '',
            lectureDesc: '',
            lectureThumb: '',
            lectureAdded: false,
            // Add Tests
            topic: '',
            testNumber: 0,
            question: '',
            correctAnswer: '',
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            testAdded: false,
            // Add Tasks
            setDate: '',
            client: '',
            clientUuid: '',
            manager: '',
            managerUuid: '',
            purpose: '',
            status: '',
            postponed: '',
            endUntil: '',
            taskAdded: false,
            // Add Sales
            product: '',
            saleStatus: '',
            activePeriod: '',
            ends: '',
            totalSum: 0,
            saleAdded: false,
        }
        this.getUser();
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
        this.togglePopup=this.togglePopup.bind(this)
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
                if (userEmail === response[0].email && userDate === response[0].date && response[0].role === 'admin') {
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
    }

    handleEditUser = (event) => {
        if (this.state.clientEmail) {
            if (this.state.clientRole) {
                let response
                const data = {clientRole: this.state.clientRole, clientEmail: this.state.clientEmail}
                fetch('/api/updateUserRole', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                  })
                  .then(res => response = res.status)
                  .then(() => {
                    if (response === 200)
                        this.setState({roleChanged: true})
                        this.prepareUserChangePopup()
                  })
            }
            if (this.state.clientGroup) {
                let response
                const data = {clientGroup: this.state.clientGroup, clientEmail: this.state.clientEmail}
                fetch('/api/updateUserGroup', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                  })
                  .then(res => response = res.status)
                  .then(() => {
                    if (response === 200) 
                        this.setState({groupChanged: true})
                        this.prepareUserChangePopup()
                  })
            }
        }
        event.preventDefault()
    }

    prepareUserChangePopup = () => {
        if (this.state.groupChanged && !this.state.roleChanged) {
            this.setState({showPopup: true, popupText: "Группа успешно обновлена!"})
        } else if (this.state.roleChanged && !this.state.groupChanged) {
            this.setState({showPopup: true, popupText: "Роль успешно обновлена!"})
        } else if (this.state.groupChanged && this.state.roleChanged) {
            this.setState({showPopup: true, popupText: "Роль и группа успешно обновлены!"})
        } else if (!this.state.groupChanged && !this.state.roleChanged) {
            this.setState({showPopup: true, popupText: "Что-то пошло не так. Группа и роль не обновлены."})
        }
        this.setState({groupChanged: false, roleChanged: false, clientEmail: '', clientRole: '', clientGroup: ''})
    }

    handleAddLectures = (event) => {
        let response
        const data = {
            lectureUrl: this.state.lectureUrl, 
            clientGroup: this.state.clientGroup, 
            lectureName: this.state.lectureName, 
            lectureDesc: this.state.lectureDesc, 
            lectureThumb: this.state.lectureThumb
        }
        fetch('/api/addLectures', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => response = res.status)
          .then(() => {
            if (response === 200) 
                this.setState({lectureAdded: true})
                this.prepareLectureAddPopup()
          })
        
        event.preventDefault()
    }

    prepareLectureAddPopup = () => {
        if (this.state.lectureAdded) {
            this.setState({showPopup: true, popupText: "Лекция успешно добавлена!"})
        } else this.setState({showPopup: true, popupText: "Что-то пошло не так. Лекция не добавлена."})
        this.setState({lectureAdded: false, lectureUrl: '', clientGroup: '', lectureName: '', lectureDesc: '', lectureThumb: ''})
    }

    handleAddTests = (event) => {
        let response
        const data = {
            clientGroup: this.state.clientGroup,
            topic: this.state.topic, 
            testNumber: this.state.testNumber, 
            question: this.state.question, 
            correctAnswer: this.state.correctAnswer, 
            answer1: this.state.answer1,
            answer2: this.state.answer2,
            answer3: this.state.answer3,
            answer4: this.state.answer4
        }
        fetch('/api/addTests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => response = res.status)
          .then(() => {
            if (response === 200) 
                this.setState({testAdded: true})
                this.prepareTestsAddPopup()
          })
        
        event.preventDefault()
    }

    prepareTestsAddPopup = () => {
        if (this.state.testAdded) {
            this.setState({showPopup: true, popupText: "Тест успешно добавлен!"})
        } else this.setState({showPopup: true, popupText: "Что-то пошло не так. Тест не добавлен."})
        this.setState({testAdded: false, clientGroup: '', topic: '', testNumber: 0, question: '', correctAnswer: '', answer1: '', answer2: '', answer3: '', answer4: ''})
    }

    handleAddTasks = (event) => {
        let response
        const data = {
            setDate: this.state.setDate,
            client: this.state.client,
            clientUuid: this.state.clientUuid,
            manager: this.state.manager,
            managerUuid: this.state.managerUuid,
            purpose: this.state.purpose,
            status: this.state.status,
            postponed: this.state.postponed,
            endUntil: this.state.endUntil,
        }
        fetch('/api/addTasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => response = res.status)
          .then(() => {
            if (response === 200) 
                this.setState({taskAdded: true})
                this.prepareTasksAddPopup()
          })
        
        event.preventDefault()
    }

    prepareTasksAddPopup = () => {
        if (this.state.taskAdded) {
            this.setState({showPopup: true, popupText: "Задача успешно добавлена!"})
        } else this.setState({showPopup: true, popupText: "Что-то пошло не так. Задача не добавлена."})
        this.setState({taskAdded: false, setDate: '', client: '', clientUuid: '', manager: '', managerUuid: '', purpose: '', status: '', postponed: '', endUntil: ''})
    }

    handleAddSales = (event) => {
        let response
        const data = {
            product: this.state.product,
            clientUuid: this.state.clientUuid,
            saleStatus: this.state.saleStatus,
            activePeriod: this.state.activePeriod,
            ends: this.state.ends,
            totalSum: this.state.totalSum,
        }
        fetch('/api/addSales', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => response = res.status)
          .then(() => {
            if (response === 200) 
                this.setState({saleAdded: true})
                this.prepareSalesAddPopup()
          })
        
        event.preventDefault()
    }

    prepareSalesAddPopup = () => {
        if (this.state.saleAdded) {
            this.setState({showPopup: true, popupText: "Покупка успешно добавлена!"})
        } else this.setState({showPopup: true, popupText: "Что-то пошло не так. Покупка не добавлена."})
        this.setState({saleAdded: false, product: '', clientUuid: '', saleStatus: '', activePeriod: '', ends: '', totalSum: ''})
    }

    render() {
        return (
            <div className="CourseAdminPage">
                {this.state.isLoggedIn ? (
                    <div>
                        <SideNav userId={this.state.id} img={this.state.image} role={this.state.role}/>
                        <ContentHead text="Админ-панель"/>
                        {this.state.showPopup ? 
                            <Popup
                                text={this.state.popupText}
                                closePopup={this.togglePopup.bind(this)}
                            />
                            : null
                        } 
                        <div className="adminSection">
                            <button onClick={() => this.setState({showUserEdit: true})}>Редактирование пользователя</button>
                            <button onClick={() => this.setState({showAddLectures: true})}>Добавление видеолекций</button>
                            <button onClick={() => this.setState({showAddTests: true})}>Добавление тестов</button>
                            <button onClick={() => this.setState({showAddTasks: true})}>Добавление задач</button>
                            <button onClick={() => this.setState({showAddSales: true})}>Добавление покупок</button>
                            {this.state.showUserEdit ? (
                                <div className="editUser">
                                    <h3>Редактирование пользователя</h3>
                                    <form onSubmit={this.handleEditUser}>
                                        <input className="usernameInput" type="email" name="email" onChange={(e) => this.setState({clientEmail: e.target.value})} placeholder="Эл.адрес пользователя" required onInvalid={(e) => {e.target.setCustomValidity("Введите верный формат email адреса")}} onInput={(e) => {e.target.setCustomValidity("")}}></input>
                                        <select name="userRole" onChange={(e) => this.setState({clientRole: e.target.value})}>
                                            <optgroup label="Роль">
                                                <option value="user">user</option>
                                                <option value="manager">manager</option>
                                                <option value="admin">admin</option>
                                            </optgroup>
                                        </select>
                                        <input className="userGroupInput" type="text" name="userGroupInput" onChange={(e) => this.setState({clientGroup: e.target.value})} placeholder="Группа пользователя"></input>
                                        <button>Отправить</button>
                                    </form>
                                    <button onClick={() => this.setState({showUserEdit: false})}>Закрыть</button>
                                </div>
                            ) : null
                            }
                            {this.state.showAddLectures ? (
                                <div className="addLectures">
                                    <h3>Добавление видеолекций</h3>
                                    <form onSubmit={this.handleAddLectures}>
                                        <input className="lectureUrlInput" type="text" name="lectureUrlInput" onChange={(e) => this.setState({lectureUrl: e.target.value})} placeholder="URL" required></input>
                                        <input className="clientGroupInput" type="text" name="clientGroupInput" onChange={(e) => this.setState({clientGroup: e.target.value})} placeholder="Группа пользователя" required></input>
                                        <input className="lectureNameInput" type="text" name="lectureNameInput" onChange={(e) => this.setState({lectureName: e.target.value})} placeholder="Название" required></input>
                                        <input className="lectureDescInput" type="text" name="lectureDescInput" onChange={(e) => this.setState({lectureDesc: e.target.value})} placeholder="Описание" required></input>
                                        <input className="lectureThumbInput" type="text" name="lectureThumbInput" onChange={(e) => this.setState({lectureThumb: e.target.value})} placeholder="Миниатюра" required></input>
                                        <button>Отправить</button>
                                    </form>
                                    <button onClick={() => this.setState({showAddLectures: false})}>Закрыть</button>
                                </div>
                            ) : null
                            }
                            {this.state.showAddTests ? (
                                <div className="addTests">
                                    <h3>Добавление тестов</h3>
                                    <form onSubmit={this.handleAddTests}>
                                        <input className="clientGroupInput" type="text" name="clientGroupInput" onChange={(e) => this.setState({clientGroup: e.target.value})} placeholder="Группа" required></input>
                                        <input className="topicInput" type="text" name="topicInput" onChange={(e) => this.setState({topic: e.target.value})} placeholder="Тема" required></input>
                                        <input className="testNumberInput" type="text" name="testNumberInput" onChange={(e) => this.setState({testNumber: e.target.value})} placeholder="Номер теста" required></input>
                                        <input className="questionInput" type="text" name="questionInput" onChange={(e) => this.setState({question: e.target.value})} placeholder="Вопрос" required></input>
                                        <input className="correctAnswerInput" type="text" name="correctAnswerInput" onChange={(e) => this.setState({correctAnswer: e.target.value})} placeholder="Правильный ответ" required></input>
                                        <input className="answer1Input" type="text" name="answer1Input" onChange={(e) => this.setState({answer1: e.target.value})} placeholder="Ответ 1" required></input>
                                        <input className="answer2Input" type="text" name="answer2Input" onChange={(e) => this.setState({answer2: e.target.value})} placeholder="Ответ 2" required></input>
                                        <input className="answer3Input" type="text" name="answer3Input" onChange={(e) => this.setState({answer3: e.target.value})} placeholder="Ответ 3" required></input>
                                        <input className="answer4Input" type="text" name="answer4Input" onChange={(e) => this.setState({answer4: e.target.value})} placeholder="Ответ 4" required></input>
                                        <button>Отправить</button>
                                    </form>
                                    <button onClick={() => this.setState({showAddTests: false})}>Закрыть</button>
                                </div>
                            ) : null
                            }
                            {this.state.showAddTasks ? (
                                <div className="addTasks">
                                    <h3>Добавление задач</h3>
                                    <form onSubmit={this.handleAddTasks}>
                                        <input className="setDateInput" type="text" name="setDateInput" onChange={(e) => this.setState({setDate: e.target.value})} placeholder="Поставлена" required></input>
                                        <input className="clientInput" type="text" name="clientInput" onChange={(e) => this.setState({client: e.target.value})} placeholder="Клиент" required></input>
                                        <input className="clientUuidInput" type="text" name="clientUuidInput" onChange={(e) => this.setState({clientUuid: e.target.value})} placeholder="UUID клиента" required></input>
                                        <input className="managerInput" type="text" name="managerInput" onChange={(e) => this.setState({manager: e.target.value})} placeholder="Менеджер" required></input>
                                        <input className="managerUuidInput" type="text" name="managerUuidInput" onChange={(e) => this.setState({managerUuid: e.target.value})} placeholder="UUID менеджера" required></input>
                                        <input className="purposeInput" type="text" name="purposeInput" onChange={(e) => this.setState({purpose: e.target.value})} placeholder="Суть задачи" required></input>
                                        <input className="statusInput" type="text" name="statusInput" onChange={(e) => this.setState({status: e.target.value})} placeholder="Статус" required></input>
                                        <input className="postponedInput" type="text" name="postponedInput" onChange={(e) => this.setState({postponed: e.target.value})} placeholder="Отложена до"></input>
                                        <input className="endUntilInput" type="text" name="endUntilInput" onChange={(e) => this.setState({endUntil: e.target.value})} placeholder="Завершить до"></input>
                                        <button>Отправить</button>
                                    </form>
                                    <button onClick={() => this.setState({showAddTasks: false})}>Закрыть</button>
                                </div>
                            ) : null
                            }
                            {this.state.showAddSales ? (
                                <div className="addSales">
                                    <h3>Добавление покупок</h3>
                                    <form onSubmit={this.handleAddSales}>
                                        <input className="productInput" type="text" name="productInput" onChange={(e) => this.setState({product: e.target.value})} placeholder="Продукт" required></input>
                                        <input className="clientUuidInput" type="text" name="clientUuidInput" onChange={(e) => this.setState({clientUuid: e.target.value})} placeholder="UUID пользователя" required></input>
                                        <input className="saleStatusInput" type="text" name="saleStatusInput" onChange={(e) => this.setState({saleStatus: e.target.value})} placeholder="Статус" required></input>
                                        <input className="activePeriodInput" type="text" name="activePeriodInput" onChange={(e) => this.setState({activePeriod: e.target.value})} placeholder="Период" required></input>
                                        <input className="endsInput" type="text" name="endsInput" onChange={(e) => this.setState({ends: e.target.value})} placeholder="Заканчивается" required></input>
                                        <input className="totalSumInput" type="text" name="totalSumInput" onChange={(e) => this.setState({totalSum: e.target.value})} placeholder="Сумма оплат" required></input>
                                        <button>Отправить</button>
                                    </form>
                                    <button onClick={() => this.setState({showAddSales: false})}>Закрыть</button>
                                </div>
                            ) : null
                            }
                        </div>
                    </div>
                ) : null
                }
            </div>
        )
    }
}

export default Admin
