import React from "react";
import About from "./Components/About";
import Follow from "./Components/Follow";
import Footer from "./Components/Footer";
import Landing from "./Components/Landing";
import Navbar from "./Components/Navbar";
import Projects from "./Components/Projects";
import Skills from "./Components/Skills";
import Time from "./Components/Time";

import resume from './Files/Resume.pdf';

function App() {
  return (
    <>
      <Navbar resume={resume} />
      <Landing />
      <About resume={resume} />
      <Skills/>
      <Projects/>
      <Follow/>
      <Time/>
      <Footer/>
    </>
  );
}

export default App;
