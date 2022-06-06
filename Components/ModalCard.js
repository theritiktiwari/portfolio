import React, { useState, useEffect } from 'react';

const ModalCard = (props) => {

    const [openModal, setOpenModal] = useState();

    useEffect(() => {
        window.onclick = (event) => {
            if (event.target.id.slice(0, 4) === `open`) {
                document.getElementById(event.target.id.slice(4)).classList.add('myModal-show');
                setOpenModal(event.target.id.slice(4));
            }

            if (event.target.className === "myModal myModal-show" || event.target.className === 'close') {
                openModal && document.getElementById(openModal).classList.remove('myModal-show');
            }
        }
    }, [openModal])

    return (
        <>
            {props.project && <div className="myProject">
                <div className="left">
                    <img src={props.img} alt={`${props.title} Project`} loading='lazy' />
                </div>
                <div className="right">
                    <h2>{props.title}</h2>
                    <div className="duration">{props.starting} {props.ending} • {props.time}</div>
                    <button className="btn read" id={`open${props.title}`}>Details</button>
                </div>
            </div>}

            {props.info && <div className='info-card'>
                <div className='left'>
                    <img src={props.img} alt={`Certificate of ${props.title} Completion`} loading='lazy' />
                </div>
                <div className='right'>
                    <h2>{props.title}</h2>
                    <button className="btn info-btn" id={`open${props.title}`}>Details</button>
                </div>
            </div>}

            <div className="myModal" id={props.title}>
                <div className="description">
                    <h3 className='heading'>{props.title}</h3>
                    <span className="close">&times;</span>
                    <hr />
                    {props.date && <span>Issued : <b>{props.date}</b></span>}
                    {props.description && <p>{props.description}</p>}
                    {props.position && <p>Position : <b>{props.position}</b></p>}
                    <a className="btn more" href={props.link} target="_blank" rel="noreferrer">View More</a>
                </div>
            </div>
        </>
    )
}

export default ModalCard
