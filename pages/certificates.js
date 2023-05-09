import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import ModalCard from '../Components/ModalCard';
import Loader from '../Components/Loader';

const Certificates = ({ name, client, router, imgURL }) => {
    const [certificateData, setCertificateData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "certificates"]`);
            data.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            setCertificateData(data);
        }
        getData();
    }, [router]);

    return (
        <>
            <Head>
                <title>Certificates | {name}</title>
            </Head>
            <section className='info-container'>
                {certificateData ? certificateData.map((val, index) => {
                    return <ModalCard
                        key={index}
                        imgURL={imgURL}
                        info={true}
                        img={val.image}
                        date={val.date}
                        title={val.title}
                        link={val.link}
                        description={val.description}
                    />
                }) : <Loader />}
            </section>
        </>
    )
}

export default Certificates
