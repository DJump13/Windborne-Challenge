import React, { useState, useEffect } from "react";
import MyGlobe from "./MyGlobe";
import Sidebar from "./Sidebar";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [particleSet, setParticleSet] = useState([]);
  const [clicked, setClicked] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/balloons")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  // console.log("data:", data);
  // console.log("data[0]:", data ? data[0] : "no data yet");

  useEffect(() => {
    const particles = [];
    for (var i = 0; i < data?.length; i++) {
      particles.push({
        id: i,
        lat: data[i][0],
        lng: data[i][1],
        alt: data[i][2],
      });
    }

    // console.log("particles:", particles);

    setParticleSet(particles);
  }, [data]);

  // console.log("particleSet:", particleSet);

  return (
    //<div style={{ width: "100vw", height: "100vh" }}>
    <div className="layout">
      <Sidebar clicked={clicked} />

      {/* <div className="globe-wrapper"> */}
      <MyGlobe
        particleSet={particleSet}
        clicked={clicked}
        setClicked={setClicked}
      />
      {/* <Globe
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
              setHoverD(p);
            }}
          /> */}
      {/* </div> */}
    </div>
  );
}

export default App;
