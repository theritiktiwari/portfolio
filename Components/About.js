import React from 'react';
import Link from 'next/link'
import PortableText from "react-portable-text"

const About = ({ resume, data }) => {
    return (
        <section className="about">
            {(data) ? <div className="container" data-aos="fade-up">
                <div className="left">
                    <h1>About Me</h1>
                </div>
                <div className="right">
                    <PortableText className="main-text"
                        content={data.aboutMainText}
                        serializers={{
                            h1: props => <h1 style={{ color: "red" }} {...props} />,
                            li: ({ children }) => <li className="special-list-item">{children}</li>,
                        }}
                    />
                    <PortableText className="text"
                        content={data.aboutSubText}
                        serializers={{
                            h1: props => <h1 style={{ color: "red" }} {...props} />,
                            li: ({ children }) => <li className="special-list-item">{children}</li>,
                        }}
                    />
                    <a className="btn resume" href={`${resume}?dl=Resume.pdf`} target="_blank" rel="noreferrer">Download Resume</a>
                    <Link href="/education"><a className="btn education">Education</a></Link>
                </div>
            </div> : null}
        </section>
    )
}

export default About
