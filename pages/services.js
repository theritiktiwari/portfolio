import React from 'react';
import Head from 'next/head';
import Mode from "../Components/Mode";

const Services = (props) => {
    return (
        <>
            <Head>
                <title>Services | {props.name}</title>
            </Head>
            <Mode work={true} name={props.name} />
            <div style={{ paddingBottom: '15vh', textAlign: "center" }}>
                <section className="coding-profile">
                    <div className="container">
                        <div className="box" data-aos="fade-down">
                            <div className="logo"><img src="https://iconape.com/wp-content/files/hx/58721/svg/freelancer-1.svg" alt='freelancer' /></div>
                            <div className="text">
                                <h3>Freelancer</h3>
                                <p><b>Rating :</b> NIL</p>
                                <span>Stars</span>
                            </div>
                            <a href="https://www.freelancer.in/u/theritiktiwari" target="_blank" rel="noreferrer" className='btn profile-btn'>View Profile</a>
                        </div>

                        <div className="box" data-aos="fade-left">
                            <div className="logo"><img src="https://assets-global.website-files.com/5ec7d9f13fc8c0ec8a4c6b26/6092b794e0419d97d9b06e2b_Favicon%20256.png" alt='upwork' /></div>
                            <div className="text">
                                <h3>Upwork</h3>
                                <p><b>Rating :</b> 809</p>
                                <span>Stars</span>
                            </div>
                            <a href="https://www.upwork.com/freelancers/~011acdef71cfeec312?viewMode=1" target="_blank" rel="noreferrer" className='btn profile-btn'>View Profile</a>
                        </div>

                        <div className="box" data-aos="fade-right">
                            <div className="logo"><img src="https://logos-world.net/wp-content/uploads/2020/12/Fiverr-Logo.png" alt='fiverr' /></div>
                            <div className="text">
                                <h3>Fiverr</h3>
                                <p><b>Rating :</b> 1,885,213</p>
                                <span>1 Star</span>
                            </div>
                            <a href="https://www.fiverr.com/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>View Profile</a>
                        </div>
                    </div>
                </section>

                {/* <section className="total-problem" data-aos="zoom-in">
                    <h2 className='title'>Total Problems</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Platforms</th>
                                <th>Problems</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CodeChef</td>
                                <td>{cc_hr_he}+</td>
                            </tr>
                            <tr>
                                <td>GeeksforGeeks</td>
                                <td>{gfg}+</td>
                            </tr>
                            <tr>
                                <td>LeetCode</td>
                                <td>{leetcode}+</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><b>Total</b></td>
                                <td><b>{cc_hr_he + gfg + leetcode}+</b></td>
                            </tr>
                        </tfoot>
                        <p className='source'>Source : <a href="https://www.stopstalk.com/user/profile/theritiktiwari/" target="_blank" rel='noreferrer'>Click Here</a></p>
                    </table>
                </section> */}
            </div>
        </>
    )
}

export default Services