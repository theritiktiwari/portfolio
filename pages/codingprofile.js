import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { db } from "../Components/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

const CodingProfile = (props) => {

    const [codechef, setCodechef] = useState('');
    const [gfg, setGfg] = useState('');
    const [leetcode, setLeetcode] = useState('');
    const [hackeRank, setHackeRank] = useState('');

    const [problemData, setProblemData] = useState();
    const [totalProbelm, setTotalProbelm] = useState(0);

    useEffect(() => {
        const getData = async () => {
            const CC = await getDoc(doc(db, "rating", "CodeChef"));
            setCodechef(CC.data().rating)
            const GFG = await getDoc(doc(db, "rating", "GeeksForGeeks"));
            setGfg(GFG.data().rating)
            const LC = await getDoc(doc(db, "rating", "LeetCode"));
            setLeetcode(LC.data().rating)
            const HR = await getDoc(doc(db, "rating", "HackerRank"));
            setHackeRank(HR.data().rating)

            const querySnapshot = await getDocs(collection(db, "problems"));
            let data = [];
            let sum = 0;
            querySnapshot.forEach((doc) => {
                sum += parseInt(doc.data().problem);
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setProblemData(data);
            setTotalProbelm(sum);
        }
        getData();
    }, []);
    return (
        <>
            <Head>
                <title>Coding Profiles | {props.name}</title>
            </Head>
            {(codechef && gfg && leetcode && hackeRank && totalProbelm) ? <div style={{ paddingBottom: '15vh' }}>
                <section className="coding-profile">
                    <div className="container">
                        <div className="box" data-aos="fade-down">
                            <div className="logo"><img src="https://img.icons8.com/color/1000/000000/codechef.png" alt='codechef' /></div>
                            <div className="text">
                                <h3>CodeChef</h3>
                                <p><b>Rating :</b> {codechef}</p>
                            </div>
                            <a href="https://www.codechef.com/users/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>

                        <div className="box" data-aos="fade-left">
                            <div className="logo"><img src="https://img.icons8.com/color/1000/000000/GeeksforGeeks.png" alt='gfg' /></div>
                            <div className="text">
                                <h3>GeeksforGeeks</h3>
                                <p><b>Rating :</b> {gfg}</p>
                            </div>
                            <a href="https://auth.geeksforgeeks.org/user/theritiktiwari/profile/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>

                        <div className="box" data-aos="fade-right">
                            <div className="logo"><img src="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/1000/000000/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-shadow-tal-revivo.png" alt='leetcode' /></div>
                            <div className="text">
                                <h3>LeetCode</h3>
                                <p><b>Rating :</b> {leetcode}</p>
                            </div>
                            <a href="https://www.leetcode.com/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>

                        <div className="box" data-aos="fade-up">
                            <div className="logo"><img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/1000/000000/external-hackerrank-is-a-technology-company-that-focuses-on-competitive-programming-logo-color-tal-revivo.png" alt='hackerrank' /></div>
                            <div className="text">
                                <h3>HackerRank</h3>
                                <span><b>CPP :</b> {hackeRank}</span>
                            </div>
                            <a href="https://www.hackerrank.com/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>
                    </div>
                </section>

                <section className="total-problem" data-aos="zoom-in">
                    <h2 className='title'>Total Problems</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Platforms</th>
                                <th>Problems</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problemData && problemData.map((val, index) => {
                                return <tr key={index}>
                                    <td>{val.name}</td>
                                    <td>{val.problem}+</td>
                                </tr>
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><b>Total</b></td>
                                <td><b>{totalProbelm}+</b></td>
                            </tr>
                        </tfoot>
                        <p className='source'>Source : <a href="https://www.stopstalk.com/user/profile/theritiktiwari/" target="_blank" rel='noreferrer'>Click Here</a></p>
                    </table>
                </section>
            </div> : null}
        </>
    )
}

export default CodingProfile
