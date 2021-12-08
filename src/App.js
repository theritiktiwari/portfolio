import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Landing from "./Components/Landing";
import Mode from "./Components/Mode";
import Loader from "./Components/Loader";

import resume from './Files/Resume.pdf';

function App() {
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

    // Loader
    window.onload = () => {
      document.querySelector("#loader").style.display = "none";
    }
  }, []);
  return (
    <>
      <Router>
        {mode && <Mode mode={mode} />}
        {displayNone && <Mode displayNone={displayNone} />}
        <Loader />
        <Navbar resume={resume} />
        <Route exact path="/">
          <Landing resume={resume} />
        </Route>
      </Router>
    </>
  );
}

export default App;
