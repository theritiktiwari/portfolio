import React from 'react'

const ProjectCard = (props) => {

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
            <div className="myProject">
                <div className="left">
                    <img src={props.img} alt={`${props.title} Project`} loading='lazy' />
                </div>
                <div className="right">
                    <h2>{props.title}</h2>
                    <div className="duration">{props.starting} {props.ending} • {props.time}</div>
                    <button className="btn read" onClick={show}>Details</button>
                </div>
            </div>

            <div className="modal" id={props.title}>
                <div className="description">
                    <h3 className='heading'>{props.title}</h3>
                    <span className="close" onClick={hide}>&times;</span>
                    <hr />
                    <p>{props.description}</p>
                    <a className="btn more" href={props.link} target="_blank" rel="noreferrer">Read More</a>
                </div>
            </div>
        </>
    )
}

export default ProjectCard
