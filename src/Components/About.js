import React from 'react'

const About = () => {
    return (
        <section className="about">
            <div className="container">
                <div className="left">
                    <h1>About Me</h1>
                </div>
                <div className="right">
                    <p className="main-text">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error vero explicabo eos blanditiis recusandae similique quam? Doloremque eaque aspernatur labore? Aperiam vitae neque fuga magni!
                    </p>
                    <p className="text">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident quia, tempore laudantium repellendus quasi reprehenderit ad corporis distinctio quibusdam pariatur voluptate fugit culpa natus. A optio accusantium, dolore magnam eum neque veniam, voluptatem, porro quam cum laudantium inventore. Sequi odio obcaecati recusandae esse placeat asperiores?
                    </p>
                    <a className="btn education" href="/education">Education</a>
                    <a className="btn resume" href="/">View Resume</a>
                </div>
            </div>
        </section>
    )
}

export default About
