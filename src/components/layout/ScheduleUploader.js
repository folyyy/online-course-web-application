import React, { Component } from 'react'
import '../layout/Schedule.css'

export default class ScheduleUploader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: this.props.role || '',
            userGroup: this.props.userGroup || '',
            list: []
        }
        this.getSchedule()
      }

    getSchedule = async () => {
        const data = {userGroup: this.state.userGroup}
        if (this.state.role !== 'admin' && this.state.role !== 'manager' && this.state.userGroup) {
            const request = await fetch('/api/getUserSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const response = await request.json()
            if (response.length === 0) {
                console.log("cant find schedule")
            } else {
                this.setState({ list: response })
            }
        } else if (this.state.role === 'admin' || this.state.role === 'manager') {
            const request = await fetch('/api/getSchedule')
            const response = await request.json()
            if (response.length === 0) {
                console.log("cant find schedule")
            } else {
                this.setState({ list: response })
            }
        }
    }

    render() {
        return (
            <div>
                {this.state.role === 'user' && this.state.userGroup ?
                <p id="usersGroup">Группа: {this.state.userGroup}</p>
                : null
                }
                {this.state.list.length ? (
                <div>
                    {this.state.list.map((item) => {
                        return(
                            <div className="scheduleItem" key={item.filename + item.usergroup}>
                            <a href={`/files/${item.filename}`}><img src="/images/xlicon.png" alt=""></img></a>
                            <p>{item.filename} Группа: ({item.usergroup})</p>
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
