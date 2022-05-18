import React from 'react'

const Offers = () => {
    return (
        <>
            <section className='service-list'>
                <h1>Services</h1>
                <div className="container" data-aos="zoom-in">
                    <div className="left">

                        <div className="service-type">
                            <h3>• Static Website</h3>
                            <p>Simple Websites without any use of database.</p>
                        </div>
                        <div className="service-type">
                            <h3>• Dynamic Website</h3>
                            <p>Websites with use of database.</p>
                        </div>
                        <div className="service-type">
                            <h3>• Redesign Website</h3>
                            <p>Completely change the UI of your website.</p>
                        </div>
                    </div>
                    <div className="right">
                        <div className="service-type">
                            <h3>• PHP Website</h3>
                            <p>Any kind of website with the help of PHP Stack.</p>
                        </div>
                        <div className="service-type">
                            <h3>• MERN Stack</h3>
                            <p>Any kind of website with the help of MERN Stack.</p>
                        </div>
                        <div className="service-type">
                            <h3>• Dashboard Development</h3>
                            <p>Add a backend dashboard in the website.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Offers