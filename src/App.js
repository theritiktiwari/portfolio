import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import countapi from 'countapi-js';

import Mode from "./Components/Mode";
import Navbar from "./Components/Navbar";
import Landing from "./Components/Landing";

import Education from "./Components/Pages/Education";
import resume from './Assets/Resume.pdf';

import SkillSet from "./Components/Pages/SkillSet";
import CodingProfile from "./Components/Pages/CodingProfile";

import Project from "./Components/Pages/Project";
import Experience from "./Components/Pages/Experience";
import Services from "./Components/Pages/Services";

import Certificates from "./Components/Pages/Certificates";
// import Achievements from "./Components/Pages/Achievements";
import ECA from "./Components/Pages/ECA";

import Contact from "./Components/Pages/Contact";

function App() {
  AOS.init();
  const [count, setCount] = useState();
  
  const [mode, setMode] = useState(false);
  const [displayNone, setDisplayNone] = useState(false);

  useEffect(() => {

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
  }, []);
  
  return (
    <>
      <Router>
        {mode && <Mode mode={mode} />}
        {displayNone && <Mode displayNone={displayNone} />}
        <Navbar resume={resume} />
        <Route exact path="/"><Landing resume={resume} count={count} /></Route>
        <Route exact path="/education"><Education /></Route>
        <Route exact path="/skills"><SkillSet /></Route>
        <Route exact path="/codingProfile"><CodingProfile /></Route>
        
        <Route exact path="/openSource"><Mode work="work" /></Route>
        
        <Route exact path="/projects"><Project /></Route>
        <Route exact path="/experience"><Experience /></Route>
        {/* <Route exact path="/services"><Services /></Route> */}
        
        <Route exact path="/certificates"><Certificates /></Route>
        
        <Route exact path="/achievements"><Mode work="work" /></Route>
        {/* <Route exact path="/achievements"><Achievements /></Route> */}

        <Route exact path="/eca"><ECA /></Route>

        <Route exact path="/contact"><Contact /></Route>

        {/* <Route exact path="*"><Mode error='error' /></Route> */}
      </Router>
    </>
  );
}

export default App;
