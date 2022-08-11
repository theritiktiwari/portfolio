import React from 'react';
import Head from 'next/head'

const resume = ({ resume, name }) => {
    return (
        <>
            <Head>
                <title>Resume | {name}</title>
            </Head>
            <section className="resume-container">
                <iframe src={resume} frameborder="0" width={"100%"}></iframe>
            </section>
        </>
    )
}

export default resume