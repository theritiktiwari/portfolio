import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Loader from '../Components/Loader';

const Links = ({ name, client, router }) => {
    const [linkData, setLinkData] = useState();
    useEffect(() => {
        const getData = async () => {
            const data = await client.fetch(`*[_type == "links"]`);
            setLinkData(data);
        }
        getData();
    }, [router]);
    linkData && console.log(linkData);
    return (
        <>
            <Head>
                <title>Links | {name}</title>
            </Head>
            <div className="links-container">
                <h1>Links</h1>
                <ul className='links'>
                    {linkData ? linkData.map((val, index) => {
                        return (
                            <a key={index} href={val.link} target='_blank' rel='noopener noreferrer'>
                                <li>- {val.name}</li>
                            </a>
                        )
                    }) : <Loader />}
                </ul>
            </div>
        </>
    )
}

export default Links