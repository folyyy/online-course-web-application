import React, { Component } from 'react'
import '../layout/Tests.css'
import SideNav from '../layout/SideNav'
import ContentHead from '../layout/ContentHead'
import Cookies from 'js-cookie'
import Popup from '../layout/Popup'

export default class TestPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: '',
            userGroup: '',
            image: '',
            id: 0,
            isLoggedIn: false,
            topic: this.props.match.params.topic,
            test: [],
            showTestPopup: false,
            popupText: '',
            userAnswers: []
        }
        this.getUser();
      }

      toggleTestPopup() {
        this.setState({
          showTestPopup: !this.state.showTestPopup
        });
        this.toggleTestPopup=this.toggleTestPopup.bind(this)
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
        this.getTest()
      }

      getTest = async () => {
        const data = {topic: this.state.topic}
        const request = await fetch('/api/getTest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        if (response.length === 0) {
            console.log("cant find test")
        } else {
            this.setState({ test: response })
        }
      }

      checkTest = () => {
        let numberOfCorrentAnswers = 0
        let correctNumbers = []
        let correctAnswers = []
        this.state.userAnswers.forEach((item) => {
            this.state.test.forEach((i) => {
                if (item.question === i.question) {
                    if (item.answer === i.correctanswer) {
                        numberOfCorrentAnswers++
                        correctNumbers.push(i.testnumber)
                        correctAnswers.push(item.answer)
                    }
                }
            })
        })
        this.setState({showTestPopup: true, popupText: `Результаты теста: ${numberOfCorrentAnswers}/${this.state.test.length} правильных ответов. Правильные ответы: ${correctNumbers}`})
        }

        onAnswerChanged = (testQuestion, testAnswer) => {
            let index = this.state.userAnswers.findIndex(item => item.question === testQuestion)
            this.setState(({userAnswers}) => userAnswers[index] = {question: testQuestion, answer: testAnswer})
        }

    render() {
        return (
            <div className="CourseTestsPage">
                {this.state.isLoggedIn ? (
                    <div>
                        <SideNav userId={this.state.id} img={this.state.image} role={this.state.role}/>
                        <ContentHead text="Тесты"/>
                        {this.state.showTestPopup ? 
                        <Popup
                            text={this.state.popupText}
                            closePopup={this.toggleTestPopup.bind(this)}
                        />
                        : null
                        }  
                        <div className="contentBody">
                            {this.state.test.length ? (
                                <div>
                                    <form className="testsItemForm">
                                        {this.state.test.map((item) => {
                                            if (this.state.userAnswers.length < this.state.test.length)
                                                this.state.userAnswers.push({question: item.question})
                                            return(
                                                    <div key={item.id}>
                                                        <h2>{item.testnumber}. {item.question}</h2>
                                                        <div className="checkBox">
                                                            <input className="answer" name={`answer1${item.id}`} id={`answer1${item.id}`} type='radio' value={item.answer1} onChange={() => this.onAnswerChanged(item.question, item.answer1)}></input>
                                                            <label htmlFor={`answer1${item.id}`}>{item.answer1}</label>
                                                        </div>
                                                        <div className="checkBox">
                                                            <input className="answer" name={`answer1${item.id}`} id={`answer2${item.id}`} type='radio' value={item.answer2} onChange={() => this.onAnswerChanged(item.question, item.answer2)}></input>
                                                            <label htmlFor={`answer2${item.id}`}>{item.answer2}</label>
                                                        </div>
                                                        <div className="checkBox">
                                                            <input className="answer" name={`answer1${item.id}`} id={`answer3${item.id}`} type='radio' value={item.answer3} onChange={() => this.onAnswerChanged(item.question, item.answer3)}></input>
                                                            <label htmlFor={`answer3${item.id}`}>{item.answer3}</label>
                                                        </div>
                                                        <div className="checkBox">
                                                            <input className="answer" name={`answer1${item.id}`} id={`answer4${item.id}`} type='radio' value={item.answer4} onChange={() => this.onAnswerChanged(item.question, item.answer4)}></input>
                                                            <label htmlFor={`answer4${item.id}`}>{item.answer4}</label>
                                                        </div>
                                                    </div>
                                            );
                                        })}
                                    </form>
                                    <button id="testConfirmButton" onClick={this.checkTest}>Отправить</button>
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
