import React, { Component } from 'react'
import '../layout/Tests.css'
import SideNav from '../layout/SideNav'
import ContentHead from '../layout/ContentHead'
import Cookies from 'js-cookie'
import Popup from '../layout/Popup'

export default class Tests extends Component {
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
        let correctAnswers = []
        let numberOfCorrentAnswers = 0
        let correctNumbers = []
        let answers = document.getElementsByName("answer")
        let userAnswer = []
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].checked)
            userAnswer.push(answers[i].value)
        }

        for (let item = 0; item < this.state.test.length; item++) {
            for (let i = 0; i < userAnswer.length; i++) {
                if (userAnswer[i] === this.state.test[item].correctanswer) {
                    numberOfCorrentAnswers++
                    correctNumbers.push(i+1)
                    correctAnswers.push(userAnswer[i])
                }
            }
        }

        this.setState({showTestPopup: true, popupText: `Результаты теста: ${numberOfCorrentAnswers}/${this.state.test.length} правильных ответов. Правильные ответы: ${correctNumbers}`})

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
                                        {this.state.test.map((item) => {
                                            return(
                                                    <form className="testsItemForm" key={item.id}>{item.testnumber}. {item.question}
                                                        <li>
                                                            <input name="answer" id="answer1" type='radio' value={item.answer1}></input>{item.answer1}
                                                        </li>
                                                        <li>
                                                            <input name="answer" id="answer2" type='radio' value={item.answer2}></input>{item.answer2}
                                                        </li>
                                                        <li>
                                                            <input name="answer" id="answer3" type='radio' value={item.answer3}></input>{item.answer3}
                                                        </li>
                                                        <li>
                                                            <input name="answer" id="answer4" type='radio' value={item.answer4}></input>{item.answer4}
                                                        </li>
                                                    </form>
                                            );
                                        })}
                                        <button onClick={this.checkTest}>Отправить</button>
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
