import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Script from 'next/script'
import LoadingBar from 'react-top-loading-bar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import countapi from 'countapi-js';
import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';

import Mode from "../Components/Mode";
import Header from '../Components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const name = "Ritik Tiwari";
  const color = "#0060FF";

  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState();
  const [resume, setResume] = useState();
  const [mode, setMode] = useState(false);
  const [displayNone, setDisplayNone] = useState(false);

  const client = createClient({ projectId: "v15x0wbi", dataset: "production", apiVersion: '2022-08-01', useCdn: false });
  const builder = imageUrlBuilder(client);
  const imgURL = (source) => {
    return builder.image(source)
  }

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setProgress(40)
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })

  }, [router]);

  useEffect(() => {
    AOS.init();
    countapi.visits().then((result) => {
      let c = result.value > 1000 ? result.value / 1000 : result.value;
      c = c > 100 ? parseInt(c) : c.toFixed(1);
      result.value > 1000 ? setCount(c + 'k+') : setCount(parseInt(c) + '');
    });

    const detectDevice = () => {
      if (navigator.maxTouchPoints && window.screen.orientation.angle && window.innerHeight < 750) {
        setMode(true);
      } else {
        setMode(false);
      }
      if (window.innerWidth < 360) {
        setDisplayNone(true);
      }
    }
    detectDevice();
    window.addEventListener('resize', detectDevice);

    const getResume = async () => {
      const data = await client.fetch(`*[_type == "home"]{"resume": resume.asset->url}`);
      setResume(data[0].resume)
    }
    getResume();
  }, []);

  return <>
    <Head>
      <meta charset="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content={color} />
      <meta
        name={`${name} | Developer`}
        content="A passionate web developer and blockchain enthusiast. Love to think about new ideas and build them."
      />
      <title>{name} | Developer</title>
    </Head>
    <Script src="https://kit.fontawesome.com/767a85f1ee.js" crossorigin="anonymous" />

    <LoadingBar
      color={color}
      height={3}
      progress={progress}
      waitingTime={800}
      onLoaderFinished={() => setProgress(0)}
    />
    {mode && <Mode mode={mode} name={name} />}
    {displayNone && <Mode displayNone={displayNone} name={name} />}
    {pageProps.statusCode !== 404 && pageProps.statusCode !== 500 && <Header name={name} resume={resume} />}
    <Component {...pageProps} name={name} count={count} client={client} router={router} imgURL={imgURL} resume={resume} />
  </>
}

export default MyApp
