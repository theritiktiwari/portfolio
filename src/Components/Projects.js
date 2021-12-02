import React from 'react'

const Projects = () => {
    return (
        <section className="projects">
            <h1>My Projects</h1>
            <div className="projects-container">
                <div className="project-card">
                    <div className="project-badge">
                        <p>Jan 01, 2022</p>
                    </div>
                    <div className="project-card-image">
                        <img src="https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=20&m=1093110112&s=612x612&w=0&h=3OhKOpvzOSJgwThQmGhshfOnZTvMExZX2R91jNNStBY=" alt="project-image" />
                    </div>
                    <div className="project-card-info">
                        <h2>Project 1</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                        <div className="project-card-info-links">
                            <a className="btn read" href="/">Read More</a>
                        </div>
                    </div>
                </div>

                <div className="project-card">
                    <div className="project-badge">
                        <p>Jan 02, 2022</p>
                    </div>
                    <div className="project-card-image">
                        <img src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg" alt="project-image" />
                    </div>
                    <div className="project-card-info">
                        <h2>Project 2</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                        <div className="project-card-info-links">
                            <a className="btn read" href="/">Read More</a>
                        </div>
                    </div>
                </div>
                
                <div className="project-card">
                    <div className="project-badge">
                        <p>Jan 03, 2022</p>
                    </div>
                    <div className="project-card-image">
                        <img src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80" alt="project-image" />
                    </div>
                    <div className="project-card-info">
                        <h2>Project 3</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                        <div className="project-card-info-links">
                            <a className="btn read" href="/">Read More</a>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Projects
