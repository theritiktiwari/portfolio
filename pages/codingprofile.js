import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Loader from '../Components/Loader';

const CodingProfile = ({ name, client, router }) => {

    const [problemData, setProblemData] = useState();
    const [totalProbelm, setTotalProbelm] = useState(0);

    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "coding"]`);
            setProblemData(data[0]);
            const cc = isNumber(parseInt(data[0].codechefProblem)) ? parseInt(data[0].codechefProblem) : 0;
            const cf = isNumber(parseInt(data[0].codeforcesProblem)) ? parseInt(data[0].codeforcesProblem) : 0;
            const gfg = isNumber(parseInt(data[0].geeksforgeeksProblem)) ? parseInt(data[0].geeksforgeeksProblem) : 0;
            const lc = isNumber(parseInt(data[0].leetcodeProblem)) ? parseInt(data[0].leetcodeProblem) : 0;
            const cn = isNumber(parseInt(data[0].codingninjaProblem)) ? parseInt(data[0].codingninjaProblem) : 0;
            const hk = isNumber(parseInt(data[0].hackerrankProblem)) ? parseInt(data[0].hackerrankProblem) : 0;

            const sum = cc + cf + gfg + lc + cn + hk;
            setTotalProbelm(sum);
        }
        getData();
    }, [router]);

    const isNumber = (value) => {
        return !isNaN(value);
    }

    return (
        <>
            <Head>
                <title>Coding Profiles | {name}</title>
            </Head>
            {problemData ? <div style={{ paddingBottom: '15vh' }}>
                <section className="coding-profile">
                    <div className="container">
                        {problemData.codechef && <div className="box" data-aos="fade-down">
                            <div className="logo"><img src="https://img.icons8.com/color/1000/000000/codechef.png" alt='codechef' /></div>
                            <div className="text">
                                <h3>CodeChef</h3>
                                <p><b>Rating :</b> {problemData.codechef}</p>
                            </div>
                            <a href="https://www.codechef.com/users/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>}

                        {problemData.codingninja && <div className="box" data-aos="fade-down">
                            <div className="logo"><img src="https://i.ibb.co/F4xL2VP/cn-removebg-preview.png" alt='codingninja' /></div>
                            <div className="text">
                                <h3>CodingNinja</h3>
                                <p><b>Level :</b> {problemData.codingninja}</p>
                            </div>
                            <a href="https://www.codingninjas.com/studio/profile/theritiktiwari" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>}

                        {problemData.geeksforgeeks && <div className="box" data-aos="fade-left">
                            <div className="logo"><img src="https://img.icons8.com/color/1000/000000/GeeksforGeeks.png" alt='gfg' /></div>
                            <div className="text">
                                <h3>GeeksforGeeks</h3>
                                <p><b>Rating :</b> {problemData.geeksforgeeks}</p>
                            </div>
                            <a href="https://auth.geeksforgeeks.org/user/theritiktiwari/profile/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>}

                        {problemData.leetcode && <div className="box" data-aos="fade-right">
                            <div className="logo"><img src="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/1000/000000/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-shadow-tal-revivo.png" alt='leetcode' /></div>
                            <div className="text">
                                <h3>LeetCode</h3>
                                <p><b>Rating :</b> {problemData.leetcode}</p>
                            </div>
                            <a href="https://www.leetcode.com/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>}

                        {problemData.hackerrank && <div className="box" data-aos="fade-up">
                            <div className="logo"><img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/1000/000000/external-hackerrank-is-a-technology-company-that-focuses-on-competitive-programming-logo-color-tal-revivo.png" alt='hackerrank' /></div>
                            <div className="text">
                                <h3>HackerRank</h3>
                                <span><b>CPP :</b> {problemData.hackerrank}</span>
                            </div>
                            <a href="https://www.hackerrank.com/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                        </div>}
                    </div>
                </section>

                {totalProbelm && <section className="total-problem" data-aos="zoom-in">
                    <h2 className='title'>Total Problems</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Platforms</th>
                                <th>Problems</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problemData.codechefProblem && <tr>
                                <td>CodeChef</td>
                                <td>{problemData.codechefProblem}+</td>
                            </tr>}
                            {problemData.leetcodeProblem && <tr>
                                <td>LeetCode</td>
                                <td>{problemData.leetcodeProblem}+</td>
                            </tr>}
                            {problemData.codingninjaProblem && <tr>
                                <td>CodingNinja</td>
                                <td>{problemData.codingninjaProblem}+</td>
                            </tr>}
                            {problemData.geeksforgeeksProblem && <tr>
                                <td>GeeksForGeeks</td>
                                <td>{problemData.geeksforgeeksProblem}+</td>
                            </tr>}
                            {problemData.hackerrankProblem && <tr>
                                <td>HackerRank</td>
                                <td>{problemData.hackerrankProblem}+</td>
                            </tr>}
                            {problemData.codeforcesProblem && <tr>
                                <td>CodeForces</td>
                                <td>{problemData.codeforcesProblem}+</td>
                            </tr>}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><b>Total</b></td>
                                <td><b>{totalProbelm}+</b></td>
                            </tr>
                        </tfoot>
                        <p className='source'>Source : <a href="https://www.stopstalk.com/user/profile/theritiktiwari/" target="_blank" rel='noreferrer'>Click Here</a></p>
                    </table>
                </section>}
            </div> : <Loader />}
        </>
    )
}

export default CodingProfile
