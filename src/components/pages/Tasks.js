import React, { Component } from 'react'
import '../layout/Tasks.css'
import SideNav from '../layout/SideNav'
import Cookies from 'js-cookie'
import ContentHead from '../layout/ContentHead'
import ProfilePopup from '../layout/ProfilePopup'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
                        <TableContainer component={Paper}>
                            <Table className='table' size="medium" aria-label="a dense table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Номер</TableCell>
                                    <TableCell align="right">Поставлена</TableCell>
                                    <TableCell align="right">Клиент</TableCell>
                                    <TableCell align="right">Менеджер</TableCell>
                                    <TableCell align="right">Суть&nbsp;задачи</TableCell>
                                    <TableCell align="right">Статус</TableCell>
                                    <TableCell align="right">Отложена&nbsp;до</TableCell>
                                    <TableCell align="right">Завершить&nbsp;до</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.tasks.map((row) => (
                                    <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="right">{row.setdate}</TableCell>
                                    <TableCell className="userCell" align="right" onClick={() => this.handleClick(row.clientuuid)}>{row.client}</TableCell>
                                    <TableCell align="right">{row.manager}</TableCell>
                                    <TableCell align="right">{row.purpose}</TableCell>
                                    <TableCell align="right">{row.status}</TableCell>
                                    <TableCell align="right">{row.postponed}</TableCell>
                                    <TableCell align="right">{row.enduntil}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                            {/* <table>
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
                            </table> */}
                        </div> 
                    </div>
                ) : null
                }
            </div>
        )
    }
}

export default Tasks
