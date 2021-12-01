import React from "react";
import About from "./Components/About";
import Footer from "./Components/Footer";
import Landing from "./Components/Landing";
import Navbar from "./Components/Navbar";
import Skills from "./Components/Skills";
import Time from "./Components/Time";

function App() {
  return (
    <>
      <Navbar />
      <Landing />
      <About />
      <Skills/>
      <Time/>
      <Footer/>
    </>
  );
}

export default App;
