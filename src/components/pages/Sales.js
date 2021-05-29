import React, { Component } from 'react'
import '../layout/Sales.css'
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


export class Sales extends Component {
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
            sales: [],
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
        this.getSales()
      }

    getSales = async () => {
        const request = await fetch('/api/getSales', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        const response = await request.json()
        if (response.length === 0) {
            console.log("cant find sales")
        } else {
            this.setState({ sales: response })
        }
    }

    handleClick = (uuid) => {
        this.setState({clientUuid: uuid, showProfilePopup: true})
    }


    render() {
        return (
            <div className="CourseSalesPage">
                {this.state.isLoggedIn ? (
                    <div>
                        <SideNav userId={this.state.id} img={this.state.image} role={this.state.role}/>
                        <ContentHead text="Покупки"/>
                        {this.state.showProfilePopup ? 
                        <ProfilePopup
                            uuid={this.state.clientUuid}
                            closePopup={this.toggleProfilePopup.bind(this)}
                        />
                        : null
                        } 
                        <div className="salesSection">
                        <TableContainer component={Paper}>
                            <Table className='table' size="medium" aria-label="a dense table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Номер</TableCell>
                                    <TableCell align="right">Продукт</TableCell>
                                    <TableCell align="right">Пользователь</TableCell>
                                    <TableCell align="right">Статус</TableCell>
                                    <TableCell align="right">Период</TableCell>
                                    <TableCell align="right">Заканчивается</TableCell>
                                    <TableCell align="right">Сумма оплат</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.sales.map((row) => (
                                    <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="right">{row.product}</TableCell>
                                    <TableCell className="userCell" align="right" onClick={() => this.handleClick(row.clientuuid)}>{row.client_name}</TableCell>
                                    <TableCell align="right">{row.status}</TableCell>
                                    <TableCell align="right">{row.activeperiod}</TableCell>
                                    <TableCell align="right">{row.ends}</TableCell>
                                    <TableCell align="right">{row.totalsum}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </div> 
                    </div>
                ) : null
                }
            </div>
        )
    }
}

export default Sales
