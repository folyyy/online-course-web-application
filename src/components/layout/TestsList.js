import React, { Component } from 'react'
import '../layout/Schedule.css'

export default class ScheduleUploader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: this.props.role || '',
            userGroup: this.props.userGroup || '',
            isLoggedIn: this.props.isLoggedIn || '',
            testsList: []
        }
        this.getTests()
      }

      getTests = async () => {
        const data = {userGroup: this.state.userGroup}
        const request = await fetch('/api/getTestsList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        if (response.length === 0) {
            console.log("cant find tests")
        } else {
            this.setState({ testsList: response })
        }
      }

    render() {
        return (
            <div>
                {this.state.role === 'user' && this.state.userGroup ?
                <p id="usersGroup">Группа: {this.state.userGroup}</p>
                : null
                }
                {this.state.testsList.length ? (
                <div>
                    {this.state.testsList.map((item) => {
                        return(
                            <div className="testsItem" key={item.topic}>
                                <a href={`/course/tests/${item.topic}`}><img src="/images/testicon.png" alt=""></img></a>
                                <p>{item.topic}</p>
                            </div>
                        );
                    })}
                </div>
                ) : null  
                }
            </div>
        )
    }
}
