import React, { useState, useEffect } from 'react'

const Time = (props) => {
    const [time, setTime] = useState();
    
    useEffect(() => {
        const updateTime = () => {
            const date = new Date();
            const mode = date.getHours() < 12 ? 'AM' : 'PM';
            let hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
            hours = (hours === 0) ? 12 : hours;
            hours = (hours < 10) ? "0" + hours : hours;
            const minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
            const seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
            setTime(`${hours}:${minutes}:${seconds} ${mode}`);
        };
        
        setInterval(updateTime, 1000);
    }, []);
    
    return (
        <section className="time">
            <div className="left">
                <p className="clock">{time}</p>
            </div>
            <div className="right">
                <p className="visitor">TOTAL VISITORS : {props.count ? props.count : "1.3k+"}</p>
            </div>
        </section>
    )
}

export default Time
