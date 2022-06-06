import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import AddAdmin from '../../Components/admin/AddAdmin';
import Validate from '../../Components/admin/Validate';

const index = (props) => {
    return (
        <>
            <Head>
                <title>Authentication | {props.name}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous" />
            </Head>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossOrigin="anonymous" />

            {/* <AddAdmin /> */}
            <Validate />
        </>
    )
}

export default index