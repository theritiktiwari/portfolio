import React from 'react';

const Education = () => {

    document.title = 'Education | Ritik Tiwari';

    const KV = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/education%2FKV.png?alt=media&token=5ca826d6-e1bd-4ecf-8f3c-415e5c67d5bd';
    const VIT = 'https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/education%2FVIT.png?alt=media&token=2afb2a59-dd4e-4bca-af41-1e41e9cd6642';

    return (
        <section className="details-container">
            <div className="center-line"></div>
            <div className="row row-1">
                <div className="box" data-aos="fade-right">
                    <i className="icon edu-icon fas fa-graduation-cap"></i>
                    <div className="head">
                        <div className="title">Bachelor of Technology</div>
                        <img src={VIT} alt="UG" className='edu-img' loading='lazy' />
                        <b>Vellore Institute of Technology, Chennai</b>
                    </div>
                    <p className='details'>Computer Science and Engineering, Specialization in Cyber Physical System</p>
                    <div className="bottom"><b>8.26 CGPA</b></div>
                    <div className="bottom">2020 - Present</div>
                </div>
            </div>
            <div className="row row-2">
                <div className="box" data-aos="fade-left">
                    <i className="icon edu-icon fas fa-university"></i>
                    <div className="head">
                        <div className="title">Intermediate</div>
                        <img src={KV} alt="XII" className='edu-img' loading='lazy' />
                        <b>Kendriya Vidyalaya, NTPC Dibiyapur</b>
                    </div>
                    <p className='details'>PCM with Computer Science</p>
                    <div className="bottom"><b>93%</b></div>
                    <div className="bottom">2017 - 2019</div>
                </div>
            </div>
            <div className="row row-1">
                <div className="box" data-aos="fade-right">
                    <i className="icon edu-icon fas fa-school"></i>
                    <div className="head">
                        <div className="title">High School</div>
                        <img src={KV} alt="X" className='edu-img' loading='lazy' />
                        <b>Kendriya Vidyalaya, NTPC Dibiyapur</b>
                    </div>
                    <div className="bottom"><b>9.2 CGPA</b></div>
                    <div className="bottom">2007 - 2017</div>
                </div>
            </div>
        </section>
    )
}

export default Education
