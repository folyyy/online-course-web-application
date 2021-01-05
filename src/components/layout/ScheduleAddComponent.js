import React, { Component } from 'react'

export default class ScheduleAddComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            group: '',
            file: '',
            filePreviewUrl: ''
        }
      }

    handleFileChange = (event) => {
        event.preventDefault();
        if (event.target.files[0].size > 1000000) {
            alert("Файл не должен превышать 1MB")
        } else {
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
          this.setState({
            file: file,
            filePreviewUrl: reader.result
          });
          console.log(file)
        }
        reader.readAsDataURL(file)
        }
    }

      handleFileUpload = async (event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('filedata', this.state.file)
        data.append('userGroup', this.state.group)
        const request = await fetch('/api/uploadScheduleFile', {
            method: 'POST',
            body: data
        })
        const response = await request.status
        if (response === 404) {
            console.log("could not upload a file")
        } else {
            window.location.reload()
            console.log("file uploaded")
        }
    }

    render() {
        return (
            <div className="handleSchedule">
                <form onSubmit={this.handleFileUpload} encType="multipart/form-data">
                    <input type="file" name="filedata" onChange={this.handleFileChange} required></input>
                    <input type="text" name="userGroup" placeholder="Введите группу" onChange={(e) => this.setState({group: e.target.value})} required onInvalid={(e) => {e.target.setCustomValidity("Необходим ввод группы")}} onInput={(e) => {e.target.setCustomValidity("")}} />
                    <button id="handleScheduleButton" className="imageButton">Загрузить</button>
                </form>
                <form action="/api/deleteScheduleFile" method="POST">
                    <input type="text" name="filename" placeholder="Введите название файла" required onInvalid={(e) => {e.target.setCustomValidity("Необходим ввод названия файла")}} onInput={(e) => {e.target.setCustomValidity("")}}></input>
                    <input type="text" name="usergroup" placeholder="Введите группу" required onInvalid={(e) => {e.target.setCustomValidity("Необходим ввод группы")}} onInput={(e) => {e.target.setCustomValidity("")}} />
                    <button id="handleScheduleButton" className="imageButton">Удалить</button>
                </form>
            </div>
        )
    }
}
