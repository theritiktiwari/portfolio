import React, { useState } from 'react';
import Head from 'next/head'
import { Document, Page } from "react-pdf";

const resume = ({ resume, name }) => {
    return (
        <>
            <Head>
                <title>Resume | {name}</title>
            </Head>
            <section className="resume-container" style={{ marginTop: "100px", width: "100%" }}>
                <Document file={resume} style={{ width: "90%" }}>
                    <Page pageNumber={1} />
                </Document>
            </section>
        </>
    )
}

export default resume