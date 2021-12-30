import React from 'react';

const Experience = () => {

    document.title = 'Experience | Ritik Tiwari';

    const time = (startingMonth, startingYear) => {
        let year = new Date().getFullYear();
        let month = new Date().getMonth();

        if (startingYear === year) {
            let m = month - startingMonth + 2;
            return m + (m === 1 ? ' Month' : ' Months');
        } else {
            let y = year - startingYear;
            return y + (y === 1 ? ' Year' : ' Years') + ` ${month - startingMonth + 2} Months`;
        }
    }

    const VITFAM = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/experience%2FVITFAM.png?alt=media&token=4f23f695-351a-430d-aadd-49cd7ed908f9';
    const VIT = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/experience%2FVIT.png?alt=media&token=caf10cd9-0f75-481a-8016-66cb9eb49123';
    const FYI = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/experience%2FFYI.png?alt=media&token=8265ea90-8db8-4f97-9eaa-8e4b2d0d43c6';

    return (
        <>
            <section className="details-container">
                <div className="center-line exp-center"></div>
                <div className="row row-1">
                    <div className="box" data-aos="fade-right">
                        <i className='icon exp-icon'><img src={VITFAM} alt="VITFAM" loading='lazy' /></i>
                        <div className="main">
                            <div className="title">Social Media Head</div>
                            <b>VIT Finance & Management Club (VITFAM)</b>
                        </div>
                        <p className='date'>Oct 2021 - Present • {time(10, 2021)}</p>
                        <ul className='detail'>
                            <li>In this organisation, I lead the Social Media Department, ensuring that the club's social media handles are running properly and that the reach is growing on a daily basis.</li>
                            <li>Coordinator of Instagram LIVE "CRYPTONIC" on Crypto Currency & Blockchain.</li>
                            <li>Coordinator of Finance Fest "DeFRAUDER" Event.</li>
                        </ul>
                        <div className="bottom">
                            <a href="https://www.linkedin.com/company/vitfam" target="_blank" rel="noreferrer" className='info btn'>More Info</a>
                            {/* <Link to="/" className='cert btn'>Certificate</Link> */}
                        </div>
                    </div>
                </div>
                <div className="row row-2">
                    <div className="box" data-aos="fade-left">
                        <i className='icon exp-icon'><img src={VIT} alt="VIT" loading='lazy' /></i>
                        <div className="main">
                            <div className="title">Program Representative</div>
                            <b>Vellore Institute of Technology, Chennai</b>
                        </div>
                        <p className='date'>Oct 2021 - Present • {time(10, 2021)}</p>
                        <ul className='detail'>
                            <li>Become a Program Representative of Cyber Physical Systems Branch for 2020-21 Session.</li>
                        </ul>
                        <div className="bottom">
                            <a href="https://www.linkedin.com/school/vellore-institute-of-technology/" target="_blank" rel="noreferrer" className='info btn'>More Info</a>
                            {/* <Link to="/" className='cert btn'>Certificate</Link> */}
                        </div>
                    </div>
                </div>
                <div className="row row-1">
                    <div className="box" data-aos="fade-right">
                        <i className='icon exp-icon'><img src={FYI} alt="FYI" loading='lazy' /></i>
                        <div className="main">
                            <div className="title">Technical Team Member</div>
                            <b>Fraternity of Young Innovators (FYI)</b>
                        </div>
                        <p className='date'>Aug 2021 - Present • {time(8, 2021)}</p>
                        <ul className='detail'>
                            <li>I work in the technical department, where I add certain technical parameters to make the task more methodical.</li>
                            <li>Collaborate with the official website.</li>
                            <li>Serve on the Organizing Committee as technical assistance for events.</li>
                            <li>Serve as the club's technical backbone.</li>
                        </ul>
                        <div className="bottom">
                            <a href="https://www.linkedin.com/company/fraternity-of-young-innovators" target="_blank" rel="noreferrer" className='info btn'>More Info</a>
                            {/* <Link to="/" className='cert btn'>Certificate</Link> */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Experience
