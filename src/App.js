import React from "react";
import About from "./Components/About";
import Follow from "./Components/Follow";
import Footer from "./Components/Footer";
import Landing from "./Components/Landing";
import Navbar from "./Components/Navbar";
import Projects from "./Components/Projects";
import Skills from "./Components/Skills";
import Time from "./Components/Time";

function App() {
  return (
    <>
      <Navbar />
      <Landing />
      <About />
      <Skills/>
      <Projects/>
      <Follow/>
      <Time/>
      <Footer/>
    </>
  );
}

export default App;
