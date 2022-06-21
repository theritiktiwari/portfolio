import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const Follow = () => {
    const [linkedIn, setLinkedIn] = useState();
    const [github, setGithub] = useState('');
    const [instagram, setInstagram] = useState();
    const [youtube, setYoutube] = useState();

    useEffect(() => {
        const getData = async () => {
            const LF = await getDoc(doc(db, "followers", "LinkedIn"));
            setLinkedIn(LF.data().followers)
            const GH = await getDoc(doc(db, "followers", "GitHub"));
            setGithub(GH.data().followers)
            const IG = await getDoc(doc(db, "followers", "Instagram"));
            setInstagram(IG.data().followers)
            const YT = await getDoc(doc(db, "followers", "YouTube"));
            setYoutube(YT.data().followers)
        }
        getData();
    }, []);
    return (
        <section className="follow">
            <h1>Stay Connected</h1>
            {(linkedIn && github && instagram && youtube) ? <div className="container">
                <a className="box" href="https://linkedin.com/in/theritiktiwari" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-linkedin-in"></i></div>
                    <div className="text">
                        <h3>LinkedIn</h3>
                        <p>{linkedIn}+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://github.com/theritiktiwari" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-github"></i></div>
                    <div className="text">
                        <h3>GitHub</h3>
                        <p>{github}+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://instagram.com/codingwalls" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-instagram"></i></div>
                    <div className="text">
                        <h3>Instagram</h3>
                        <p>{instagram}+ Followers</p>
                    </div>
                </a>

                <a className="box" href="https://www.youtube.com/channel/UCaTiS60yVc1MJods9sFFtuw?sub_confirmation=1" target="_blank" rel="noreferrer">
                    <div className="logo"><i className="fab fa-youtube"></i></div>
                    <div className="text">
                        <h3>YouTube</h3>
                        <p>{youtube}+ Subscribers</p>
                    </div>
                </a>
            </div> : null}
        </section>
    )
}

export default Follow
