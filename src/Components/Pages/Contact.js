import React, { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha';
import emailjs from 'emailjs-com';

const Contact = () => {
    document.title = "Contact Me | Ritik Tiwari";

    const [verified, setVerified] = useState(false);
    const recaptchaRef = useRef();
    const sitekey = '6LdtQckdAAAAAOnDHn2huXidyPplZcFrOFtskLN9';

    const user_id = 'user_ynkg9hSPCDS2iPf69PJQc';
    const service_id = 'portfolio_gmail';
    const template_id = 'portfolio_template';

    useEffect(() => {
        recaptchaRef.current.execute();
    }, [])

    const [showmsg, setShowmsg] = useState('');
    const [showerror, setShowerror] = useState('');

    const captcha = () => {
        setVerified(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!verified) {
            alert("Captcha Failed! Please try again.");
            recaptchaRef.current.execute();
        } else {
            emailjs.sendForm(service_id, template_id, e.target, user_id)
                .then(() => {
                    setShowmsg('Message Sent Successfully !!');
                }, () => {
                    setShowerror('Message Not Sent !!');
                });
            e.target.reset();
        }
    }

    return (
        <section className='contact'>
            <h1 className='title'>Contact Me</h1>
            <p>For all enquiries, please send the message through the given form.</p>

            <form onSubmit={handleSubmit} method='POST' data-aos="zoom-in">
                <p className='msg success'>{showmsg}</p>
                <p className='msg error'>{showerror}</p>
                <div className="left">
                    <input className='input' type="text" id='name' name="name" placeholder="Name" required />
                    <input className='input' type="email" id='email' name="email" placeholder="Email" required />
                    <input className='input' type="text" id='organisation' name="organisation" placeholder="Organisation" required />
                </div>
                <div className="right">
                    <textarea className='input' name="message" id='message' cols="30" rows="9" placeholder="Type Your Message..." required></textarea>
                    <input className='btn submit' type="submit" value="Send Message" />
                </div>
            </form>

            <div className="social-media">
                <a href="https://www.linkedin.com/in/theritiktiwari/" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin"></i>
                </a>

                <a href="https://www.instagram.com/theritiktiwari/" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                </a>

                <a href="https://twitter.com/theritiktiwari" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                </a>
                <ReCAPTCHA
                    ref={recaptchaRef}
                    onChange={captcha}
                    size='invisible'
                    sitekey={sitekey} // v3 key
                // sitekey='6LdC88kdAAAAAOHqWRh_A_XyeOFgCse2bQ_fvLJW' // v2 key
                />
            </div>
            <p className="mail">Or mail me at : <a href="mailto:theritiktiwari@gmail.com">theritiktiwari@gmail.com</a></p>
        </section>
    )
}

export default Contact
