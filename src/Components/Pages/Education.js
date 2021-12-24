import React from 'react';
import KV from '../../Files/Images/KV.png';
import VIT from '../../Files/Images/VIT.png';

const Education = () => {

    document.title = 'Education | Ritik Tiwari';

    return (
        <section className="details-container">
            <div class="center-line"></div>
            <div class="row row-1">
                <div className="box" data-aos="fade-right">
                    <i class="icon edu-icon fas fa-graduation-cap"></i>
                    <div class="head">
                        <div class="title">Bachelor of Technology</div>
                        <img src={VIT} alt="UG" className='edu-img' />
                        <b>Vellore Institute of Technology, Chennai</b>
                    </div>
                    <p className='details'>Computer Science and Engineering, Specialization in Cyber Physical System</p>
                    <div class="bottom"><b>8.6 CGPA</b></div>
                    <div class="bottom">2020 - Present</div>
                </div>
            </div>
            <div class="row row-2">
                <div className="box" data-aos="fade-left">
                    <i class="icon edu-icon fas fa-university"></i>
                    <div class="head">
                        <div class="title">Intermediate</div>
                        <img src={KV} alt="XII" className='edu-img' />
                        <b>Kendriya Vidyalaya, NTPC Dibiyapur</b>
                    </div>
                    <p className='details'>PCM with Computer Science</p>
                    <div class="bottom"><b>93%</b></div>
                    <div class="bottom">2017 - 2019</div>
                </div>
            </div>
            <div class="row row-1">
                <div className="box" data-aos="fade-right">
                    <i class="icon edu-icon fas fa-school"></i>
                    <div class="head">
                        <div class="title">High School</div>
                        <img src={KV} alt="X" className='edu-img' />
                        <b>Kendriya Vidyalaya, NTPC Dibiyapur</b>
                    </div>
                    <div class="bottom"><b>9.2 CGPA</b></div>
                    <div class="bottom">2007 - 2017</div>
                </div>
            </div>
        </section>
    )
}

export default Education
