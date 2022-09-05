import React from 'react'
import Link from 'next/link';
import Head from 'next/head';

const Mode = (props) => {
    const landscape = 'https://i.ibb.co/4tsX2x3/landscape.png';
    const displayNone = 'https://i.ibb.co/0tyvSZ3/display-None.png';
    const maintenance = 'https://i.ibb.co/LtwJNyg/maintenance.png';
    const error = 'https://i.ibb.co/Nyb8btM/error.png';

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
        <>
            <Head>
                <title>{props.mode ? `Landscape | ${props.name}` : props.displayNone ? `Device Error | ${props.name}` : props.work ? `Maintenance Mode | ${props.name}` : props.error ? `Error 404 | ${props.name}` : ""}</title>
            </Head>
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
                        <Link href="/"><a className="btn" style={btnStyle}>HOME</a></Link>
                    </div>
                }
                {props.error &&
                    <div className="container" style={boxStyle}>
                        <div className="container" style={boxStyle}>
                            <img src={error} alt="mode" style={imgStyle} />
                            <h2>404</h2>
                            <p>NOT FOUND</p>
                            <p>Click the below button for your destination.</p>
                            <Link href="/"><a className="btn" style={btnStyle}>WEBSITE</a></Link>
                        </div>
                    </div>
                }
            </section>
        </>
    )
}

export default Mode
