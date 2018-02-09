import React, { Component } from 'react'
import Head from 'next/head'

export default class Index extends Component {
  state = {
    file: null,
    message: '',
    senderName: ''
  }

  bytesToSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    if (bytes == 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  }

  async upload(e) {
    e.preventDefault()
    const { file, senderName, message, loading } = this.state
    if (!file || !message.length || !senderName.length || loading) return

    this.setState({ loading: true, error: false })

    try {
      const data = new FormData()
      data.append('file', file)
      data.append('message', message)
      data.append('senderName', senderName)
      data.append('fileSize', file.size)
      const res = await fetch('/up', {
        method: 'POST',
        body: data
      })

      if (!res.ok) {
        console.log('error')
        return this.setState({ error: false, loading: false })
      }

      console.log(res)

      const { _id } = await res.json()

      this.setState({
        url: `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? `:${window.location.port}` : ''
        }/t/${_id}`,
        loading: false
      })
    } catch (err) {
      console.log(error)
      this.setState({ error: true, loading: false })
    }
  }

  renderUrl() {
    const { url } = this.state
    return (
      <div className="container">
        <h2 className="title">Here is your link:</h2>
        <input type="text" value={url} disabled className="input" />
        <style jsx>{`
          .title {
            font-weight: normal;
            margin: 16px 0;
            padding: 0;
            text-overflow: ellipsis;
            width: 280px;
            overflow: hidden;
            white-space: nowrap;
            color: white;
          }
          .container {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            z-index: 10;
            background: black;
            display: flex;
            flex-direction: column;
            padding: 0 25px;
            justify-content: center;
          }

          .input {
            color: white;
            width: 250px;
            border: none;
            border-bottom: solid rgba(255, 255, 255, 1) 1px;
            padding: 8px 0;
            outline: none;
            font-size: 16px;
            background: none;
            transition: 0.2s all;
            padding-right: 10px;
          }
        `}</style>
      </div>
    )
  }

  render() {
    const { file, senderName, message, loading, url, error } = this.state

    return (
      <div className="container">
        <Head>
          <title>Transfer</title>
        </Head>
        <div className="inner-container">
          {url && this.renderUrl()}
          <div className="inner-container">
            <form onSubmit={this.upload.bind(this)}>
              <div className="file-input__container">
                <h2 className="title">
                  {file ? file.name : '+ Add your file'}
                </h2>
                {file && (
                  <p className="file-size">{this.bytesToSize(file.size)}</p>
                )}
                <input
                  disabled={loading}
                  type="file"
                  className="file-input"
                  onChange={e => {
                    const [file] = e.target.files
                    if (file.size > 3e9)
                      return alert('File exceeds maximum of 3GB')
                    this.setState({ file: file })
                    console.log(e.target.files[0])
                  }}
                />
              </div>
              {/* <div className="input__container">
							<input type="email" className="input" placeholder="Email to" />
						</div> */}
              <div className="input__container">
                <input
                  disabled={loading}
                  type="text"
                  className="input"
                  placeholder="Your name"
                  value={senderName}
                  onChange={({ target: { value } }) =>
                    this.setState({ senderName: value })
                  }
                />
              </div>
              <div className="input__container">
                <textarea
                  disabled={loading}
                  className="input"
                  placeholder="Message"
                  rows="2"
                  value={message}
                  onChange={({ target: { value } }) =>
                    this.setState({ message: value })
                  }
                />
              </div>
              {error && <p className="error">Something went wrong</p>}
              <input
                type="submit"
                value={loading ? 'Loading' : 'Upload'}
                className={`submit-button ${
                  !file || !message.length || !senderName.length || loading
                    ? 'submit-button--disabled'
                    : ''
                }`}
                disabled={
                  !file || !message.length || !senderName.length || loading
                }
              />
            </form>
          </div>
        </div>
        <style jsx>{`
          .error {
            color: 
          }

					.inner-container {
						position: relative
					}
          .container {
            position: absolute;
            top: 50%;
            left: 48px;
            transform: translateY(-50%);
            border: solid 1px #000;
            color: #000;
            font-family: Helvetica;
            border-bottom: none;
            box-shadow: 1px 1px 16px rgba(0,0,0, .2)
          }
          .input {
            width: 250px;
            border: none;
            border-bottom: solid rgba(0, 0, 0, 0.4) 1px;
            padding: 8px 0;
            outline: none;
            font-size: 16px;
            background: none;
            transition: 0.2s all;
            color: black;
            padding-right: 10px;
          }

          input.input {
            height: 18px;
          }
          .input:focus {
            border-color: rgba(0, 0, 0, 1);
          }

          .input__container {
            position: relative;
            margin: 32px;
            margin-top: 16px;
          }
          
          .title {
            font-weight: normal;
            margin: 0;
            padding: 0;
            text-overflow: ellipsis; 
            width: 280px;
            text-align: center;
            overflow: hidden;
            white-space: nowrap; 
          }

          .file-size {
            color: #ccc;
            margin: 0;
          }

          .file-input__container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center
            flex-direction: column;
            height: 128px;
            width: 100%;
            transition: all 0.2s;
            border-bottom: 1px solid black;
          }

          .file-input__container:hover {
            color: #484848;
          }

          .file-input {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            opacity: 0;
            cursor: pointer;
          }

          .submit-button {
            width: 100%;
            border: none;
            outline: none;
            background: black;
            padding: 12px;
            color: white;
            font-size: 1.1em;
            transition: all 0.2s;
            cursor: pointer;
          }

          .submit-button--disabled {
            background: #484848;
            cursor: default;
          }

          .error {
            text-align: center;
            color: #ff001f;
          }

        `}</style>
      </div>
    )
  }
}
