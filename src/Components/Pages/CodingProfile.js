import React from 'react';

const CodingProfile = () => {
    document.title = "Coding Profiles | Ritik Tiwari";
    let cc_hr_he = 80;
    let gfg = 8;
    let leetcode = 6;
    return (
        <div style={{ paddingBottom: '15vh' }}>
            <section className="coding-profile">
                <div className="container">
                    <div className="box" data-aos="fade-down">
                        <div className="logo"><img src="https://img.icons8.com/color/1000/000000/codechef.png" alt='codechef' /></div>
                        <div className="text">
                            <h3>CodeChef</h3>
                            <p><b>Rating :</b> NIL</p>
                            {/* <span>Stars</span> */}
                        </div>
                        <a href="https://www.codechef.com/users/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                    </div>

                    <div className="box" data-aos="fade-left">
                        <div className="logo"><img src="https://img.icons8.com/color/1000/000000/GeeksforGeeks.png" alt='gfg' /></div>
                        <div className="text">
                            <h3>GeeksforGeeks</h3>
                            <p><b>Rating :</b> 809</p>
                            {/* <span>Stars</span> */}
                        </div>
                        <a href="https://auth.geeksforgeeks.org/user/theritiktiwari/profile/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                    </div>

                    <div className="box" data-aos="fade-right">
                        <div className="logo"><img src="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/1000/000000/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-shadow-tal-revivo.png" alt='leetcode' /></div>
                        <div className="text">
                            <h3>LeetCode</h3>
                            <p><b>Rating :</b> 1,885,213</p>
                            {/* <span>1 Star</span> */}
                        </div>
                        <a href="https://www.leetcode.com/theritiktiwari/" target="_blank" rel="noreferrer" className='btn profile-btn'>theritiktiwari</a>
                    </div>

                    <div className="box" data-aos="fade-up">
                        <div className="logo"><img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/1000/000000/external-hackerrank-is-a-technology-company-that-focuses-on-competitive-programming-logo-color-tal-revivo.png" alt='hackerrank' /></div>
                        <div className="text">
                            <h3>HackerRank</h3>
                            {/* <p><b>Rating :</b> NIL</p> */}
                            <span><b>CPP :</b> 5 Stars</span>
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
            </section>
        </div>
    )
}

export default CodingProfile
