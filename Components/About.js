import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const About = (props) => {
    const [mainText, setMainText] = useState('');
    const [subText, setSubText] = useState('');

    useEffect(() => {
        const getData = async () => {
            const q = await getDoc(doc(db, "about", "data"));
            setMainText(q.data().maintext);
            setSubText(q.data().subtext);
        }
        getData();
    }, []);
    return (
        <section className="about">
            <div className="container" data-aos="fade-up">
                <div className="left">
                    <h1>About Me</h1>
                </div>
                <div className="right">
                    <p className="main-text">{mainText}</p>
                    <p className="text">{subText}</p>
                    <a className="btn resume" href={props.resume} target="_blank" rel="noreferrer">View Resume</a>
                    <Link href="/education"><a className="btn education">Education</a></Link>
                </div>
            </div>
        </section>
    )
}

export default About
