import React, { Component } from 'react'
import SideNav from '../layout/SideNav'
import Cookies from 'js-cookie'
import ContentHead from '../layout/ContentHead'
import ReactPlayer from 'react-player'
import '../layout/Lectures.css'
export default class Lectures extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: '',
            userGroup: '',
            image: '',
            id: 0,
            isLoggedIn: false,
            currentVideo: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
            list: []
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
                await this.getLectures()
            }
        } else {
            this.props.history.push('/')
        }
      }

      getLectures = async () => {
        const data = {userGroup: this.state.userGroup}
        const request = await fetch('/api/getLectures', {
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
        } else {
            this.setState({ list: response, currentVideo: response[0].lectureurl})
        }
    }

    render() {
        return (
            <div className="CourseLecturesPage">
                {this.state.isLoggedIn ? (
                    <div>
                        <SideNav userId={this.state.id} img={this.state.image} role={this.state.role}/>
                        <ContentHead text="Видеолекции"/>
                        <div className="lecturesBody">
                            {this.state.list.length ? (                            
                                <div className="lecturesList">
                                    <ReactPlayer id="ReactPlayer" width="90%" height="720px" controls={true} url={this.state.currentVideo} />
                                    <ul>
                                    {this.state.list.map((item) => {
                                        return(
                                            <div className="listItem" key={item.lectureurl}>
                                                <h3 onClick={() => this.setState({currentVideo: item.lectureurl})}>{item.name}</h3><br/>
                                                <img src={item.thumbnail} alt='' onClick={() => this.setState({currentVideo: item.lectureurl})}></img>
                                                <h4>{item.description}</h4>
                                            </div>
                                        );
                                    })}
                                    </ul>
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
