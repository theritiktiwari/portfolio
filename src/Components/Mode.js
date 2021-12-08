import React from 'react'
import landscape from '../Files/Images/landscape.png';
import displayNone from '../Files/Images/displayNone.png';

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
        </section>
    )
}

export default Mode
