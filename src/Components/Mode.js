import React from 'react'
import { Link } from 'react-router-dom';

import landscape from '../Files/Images/landscape.png';
import displayNone from '../Files/Images/displayNone.png';
import maintenance from '../Files/Images/maintenance.png';
import error from '../Files/Images/error.png';

const Mode = (props) => {
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
                    <img src={landscape} alt="mode" style={imgStyle} />
                    <h2>Please Rotate your device</h2>
                    <p>Landscape mode is not supported. Please go back to portrait mode for the best experience.</p>
                </div>
            }
            {props.displayNone &&
                <div className="container" style={boxStyle}>
                    <img src={displayNone} alt="mode" style={imgStyle} />
                    <h2>Please Change your device</h2>
                    <p>Your device is not supported for this website. Please switch the device for the best experience.</p>
                </div>
            }
            {props.work &&
                <div className="container" style={boxStyle}>
                    <img src={maintenance} alt="mode" style={imgStyle} />
                    <h2>Work on Progress</h2>
                    <p>This page is under maintenance. Sorry for inconvenience.</p>
                    <Link to="/" className="btn" style={btnStyle}>HOME</Link>
                </div>
            }
            {props.error &&
                <div className="container" style={boxStyle}>
                    <div className="container" style={boxStyle}>
                        <img src={error} alt="mode" style={imgStyle} />
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
