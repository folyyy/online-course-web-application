import React, { Component } from 'react'
import '../layout/Tests.css'
import SideNav from '../layout/SideNav'
import Cookies from 'js-cookie'
import ContentHead from '../layout/ContentHead'
import TestsList from '../layout/TestsList'

export default class Tests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: '',
            userGroup: '',
            image: '',
            id: 0,
            isLoggedIn: false,
            testsList: [],
        }
        this.getUser();
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
      }

    render() {
        return (
            <div className="CourseTestsPage">
                {this.state.isLoggedIn ? (
                    <div>
                        <SideNav userId={this.state.id} img={this.state.image} role={this.state.role}/>
                        <ContentHead text="Тесты"/>
                        <div className="contentBody">
                            { this.state.role ? 
                                <TestsList userGroup={this.state.userGroup} role={this.state.role} isLoggedIn={this.state.isLoggedIn} />
                            : null
                            }
                        </div>
                    </div>
                ) : null
                }
            </div>
        )
    }
}
