import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Script from 'next/script'
import LoadingBar from 'react-top-loading-bar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import countapi from 'countapi-js';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../Components/firebase';

import Mode from "../Components/Mode";
import Header from '../Components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const name = "Ritik Tiwari";
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState();
  const [resume, setResume] = useState();
  const [mode, setMode] = useState(false);
  const [displayNone, setDisplayNone] = useState(false);

  const [user, setUser] = useState({ token: null, email: null });

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setProgress(40)
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })
    
    const myUser = JSON.parse(localStorage.getItem("myUser"));
    if (myUser) {
      setUser({ token: myUser.token, email: myUser.email });
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("myUser");
    setUser({ token: null, email: null });
    router.push("/admin");
  }

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
      const docRef = doc(db, "resume", "resumelink");
      const docSnap = await getDoc(docRef);
      setResume(docSnap.data().link);
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
      <meta name="theme-color" content="#0060FF" />
      <meta
        name="RITIK TIWARI | DEVELOPER"
        content="A passionate web developer and blockchain enthusiast. Love to think about new ideas and build them."
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

      <title>{name} | Developer</title>
    </Head>
    <Script src="https://kit.fontawesome.com/767a85f1ee.js" crossorigin="anonymous" />

    <LoadingBar
      color='#0060FF'
      height={3}
      progress={progress}
      waitingTime={800}
      onLoaderFinished={() => setProgress(0)}
    />
    {mode && <Mode mode={mode} name={name} />}
    {displayNone && <Mode displayNone={displayNone} name={name} />}
    {pageProps.statusCode !== 404 && pageProps.statusCode !== 500 && !router.pathname.includes('/admin') && <Header name={name} resume={resume} />}
    <Component {...pageProps} name={name} count={count} resume={resume} logout={logout} user={user} />
  </>
}

export default MyApp
