import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import ModalCard from '../Components/ModalCard';

const ECA = ({ name, client, router, imgURL }) => {
    const [ecaData, setEcaData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "eca"] | order(date desc)`);
            setEcaData(data);
        }
        getData();
    }, [router]);
    return (
        <>
            <Head>
                <title>Extra Curricular | {name}</title>
            </Head>
            <section className='info-container'>
                {
                    ecaData && ecaData.map((val, index) => {
                        return <ModalCard
                            imgURL={imgURL}
                            key={index}
                            info={true}
                            img={val.image}
                            date={val.date}
                            title={val.title}
                            link={val.link}
                            description={val.description}
                        />
                    })
                }
            </section>
        </>
    )
}

export default ECA
