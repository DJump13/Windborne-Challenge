import React, { useState, useEffect } from "react";
//import axios from "axios";
import Globe from "react-globe.gl";
import Sidebar from "./Sidebar";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [particleSet, setParticleSet] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/balloons")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  console.log("data:", data);
  console.log("data[0]:", data ? data[0] : "no data yet");

  useEffect(() => {
    const particles = [];
    for (var i = 0; i < data?.length; i++) {
      particles.push({
        lat: data[i][0],
        lng: data[i][1],
        alt: data[i][2],
      });
    }

    console.log("particles:", particles);
    // Create a single "set" of particles with static positions
    // const particles = Array.from({ length: 200 }).map(() => ({
    //   lat: Math.random() * 180 - 90,
    //   lng: Math.random() * 360 - 180,
    //   name: "balloon", // just example data
    // }));

    setParticleSet([particles]);
  }, [data]);

  console.log("particleSet:", particleSet);

  return (
    //<div style={{ width: "100vw", height: "100vh" }}>
    <div className="app-container">
      <Sidebar />
      <div className="globe-container">
        <div className="globe-wrapper">
          <Globe
            width={window.innerWidth}
            height={window.innerHeight}
            globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
            particlesData={particleSet}
            particleLat={(d) => d.lat}
            particleLng={(d) => d.lng}
            particleAltitude={(d) => d.alt / 6371} // normalize by earth radius
            particlesSize={1}
            particlesColor={() => "palegreen"}
            onParticleHover={(p) => {
              if (p) console.log("hovering particle:", p);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
