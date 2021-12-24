import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from "./Components/Navbar";
import Landing from "./Components/Landing";
import Mode from "./Components/Mode";

import Education from "./Components/Pages/Education";
import Experience from "./Components/Pages/Experience";
import SkillSet from "./Components/Pages/SkillSet";

import resume from './Files/Resume.pdf';

function App() {
  AOS.init();

  const [mode, setMode] = useState(false);
  const [displayNone, setDisplayNone] = useState(false);

  useEffect(() => {
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
        <Route exact path="/">
          <Landing resume={resume} />
        </Route>
        <Route exact path="/education"><Education/></Route>
        <Route exact path="/skills"><SkillSet/></Route>
        <Route exact path="/codingProfile"><Mode work="work" /></Route>
        <Route exact path="/projects"><Mode work="work" /></Route>
        <Route exact path="/projects"><Mode work="work" /></Route>
        <Route exact path="/experience"><Experience/></Route>
        <Route exact path="/certificates"><Mode work="work" /></Route>
        <Route exact path="/eca"><Mode work="work" /></Route>
        <Route exact path="/contact"><Mode work="work" /></Route>
      </Router>
    </>
  );
}

export default App;
