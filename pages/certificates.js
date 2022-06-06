import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { db } from '../Components/firebase';
import { collection, getDocs } from "firebase/firestore";

import ModalCard from '../Components/ModalCard';

const Certificates = (props) => {
    const [certificateData, setCertificateData] = useState();
    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "certificates"));
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setCertificateData(data);
        }
        getData();
    }, []);
    return (
        <>
            <Head>
                <title>Certificates | {props.name}</title>
            </Head>
            <section className='info-container'>
                {
                    certificateData && certificateData.map((val, index) => {
                        return <ModalCard
                            key={index}
                            info={true}
                            img={val.img}
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

export default Certificates
