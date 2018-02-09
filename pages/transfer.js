import 'isomorphic-fetch'
import React, { Component } from 'react'
import Head from 'next/head'

export default class Transfer extends Component {
  bytesToSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    if (bytes == 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  }

  render() {
    const {
      message,
      s3Url,
      fileName,
      senderName,
      fileSize
    } = this.props.url.query

    return (
      <div className="container">
        <Head>
          <title>{fileName} - Transfer</title>
        </Head>
        <div className="file-name__container">
          <h2 className="title">{fileName}</h2>
          <p className="file-size">{this.bytesToSize(fileSize)}</p>
        </div>
        <p className="message">
          Message: <span>{message}</span>
        </p>
        <p className="message">
          From: <span>{senderName}</span>
        </p>
        <a href={s3Url} download>
          <div className="download-button">Download</div>
        </a>
        <style jsx>{`
					.container {
						width: 300px;
						position: absolute;
						top: 50%;
						left: 48px;
						transform: translateY(-50%);
						border: solid 1px #000;
						color: #000;
						font-family: Helvetica;
						border-bottom: none;
						box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
					}

					.message {
						padding: 16px;
					}

					.message span {
						color: #777;
					}

					a {
						text-decoration: none;
					}

					.download-button {
						border: none;
						outline: none;
						background: black;
						padding: 12px 0;
						text-align: center;
						color: white;
						font-size: 1.1em;
						transition: all 0.2s;
						cursor: pointer;
						text-decoration: none;
						width: 100%;
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

          .file-name__container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center
            flex-direction: column;
            height: 128px;
            width: 300px;
            transition: all 0.2s;
            border-bottom: 1px solid black;
          }
				`}</style>
      </div>
    )
  }
}
