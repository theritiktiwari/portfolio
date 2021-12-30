import React from 'react'

const OtherCard = (props) => {

    const modal = document.getElementById(props.title);
    const m = document.getElementsByClassName('modal');

    const show = () => {
        modal.style.display = 'block';
    }
    const hide = () => {
        modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target.className === "modal") {
            for (let i = 0; i < m.length; i++) {
                m[i].style.display = 'none';
            }
        }
    }

    return (
        <>
            <div className='info-card'>
                <div className='left'>
                    <img src={props.img} alt={`Certificate of ${props.title} Completion`} loading='lazy' />
                </div>
                <div className='right'>
                    <h2>{props.title}</h2>
                    <button className="btn cert" onClick={show}>Details</button>
                </div>
            </div>

            <div className="modal" id={props.title}>
                <div className="description">
                    <h3 className='heading'>{props.title}</h3>
                    <span className="close" onClick={hide}>&times;</span>
                    <hr />
                    {props.time && <span>Issued : <b>{props.time}</b></span>}
                    {props.description && <p>{props.description}</p>}
                    {props.position && <p>Position : <b>{props.position}</b></p>}
                    <a className="btn more" href={props.link} target="_blank" rel="noreferrer">View More</a>
                </div>
            </div>
        </>
    )
}

export default OtherCard
