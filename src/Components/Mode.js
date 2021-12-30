import React from 'react'
import { Link } from 'react-router-dom';

const Mode = (props) => {

    document.title = props.mode ? "Landscape | Ritik Tiwari" : props.displayNone ? "Device Error | Ritik Tiwari" : props.work ? "Maintenance Mode | Ritik Tiwari" : props.error ? "Error 404 | Ritik Tiwari" : "";

    const landscape = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/other%2Flandscape.png?alt=media&token=48c3e22b-4056-4c8b-8951-6ab1ac1d6864';
    const displayNone = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/other%2FdisplayNone.png?alt=media&token=303e7e7f-3cdc-4b31-be2d-31fc07f2fb45';
    const maintenance = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/other%2Fmaintenance.png?alt=media&token=2d991f75-2389-44ff-be15-058b0dec6ca9';
    const error = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/other%2Ferror.png?alt=media&token=b00d49dc-bddc-4b6d-bf6d-78776a6ac975';

    const mainStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: '0',
        left: '0',
        color: '#fff',
        backgroundColor: '#0060ff',
        zIndex: '50',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
    const boxStyle = {
        width: '95vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
    }
    const imgStyle = {
        width: '200px',
        margin: '0 0 20px',
    }
    const btnStyle = {
        margin: '20px 0',
        backgroundColor: '#fff',
        color: '#0060ff',
        cursor: 'pointer',
    }
    return (
        <section style={mainStyle}>
            {props.mode &&
                <div className="container" style={boxStyle}>
                    <img src={landscape} alt="mode" style={imgStyle} loading='lazy' />
                    <h2>Please Rotate your device</h2>
                    <p>Landscape mode is not supported. Please go back to portrait mode for the best experience.</p>
                </div>
            }
            {props.displayNone &&
                <div className="container" style={boxStyle}>
                    <img src={displayNone} alt="mode" style={imgStyle} loading='lazy' />
                    <h2>Please Change your device</h2>
                    <p>Your device is not supported for this website. Please switch the device for the best experience.</p>
                </div>
            }
            {props.work &&
                <div className="container" style={boxStyle}>
                    <img src={maintenance} alt="mode" style={imgStyle} loading='lazy' />
                    <h2>Work on Progress</h2>
                    <p>This page is under maintenance. Sorry for inconvenience.</p>
                    <Link to="/" className="btn" style={btnStyle}>HOME</Link>
                </div>
            }
            {props.error &&
                <div className="container" style={boxStyle}>
                    <div className="container" style={boxStyle}>
                        <img src={error} alt="mode" style={imgStyle} loading='lazy' />
                        <h2>404</h2>
                        <p>NOT FOUND</p>
                        <p>Click the below button for your destination.</p>
                        <Link to="/" className="btn" style={btnStyle}>WEBSITE</Link>
                    </div>
                </div>
            }
        </section>
    )
}

export default Mode
