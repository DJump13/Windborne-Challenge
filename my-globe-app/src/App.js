import React, { useState, useEffect, use } from "react";
import MyGlobe from "./MyGlobe";
import Sidebar from "./Sidebar";
import "./App.css";

function App() {
  const [paths, setPaths] = useState(null);
  const [livePoss, setLivePoss] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/latest")
      .then((res) => res.json())
      .then((json) => {
        const indexedData = json.map((item, i) => ({
          id: i,
          lat: item[0],
          lng: item[1],
          alt: item[2],
        }));
        setLivePoss(indexedData);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/paths")
      .then((res) => res.json())
      .then((json) => setPaths(json))
      .catch((error) => console.error(error));
  }, []);

  // console.log("data:", data);
  // console.log("data[0]:", data ? data[0] : "no data yet");

  // useEffect(() => {
  //   const lives = [];
  //   for (var i = 0; i < data?.length; i++) {
  //     lives.push({
  //       id: i,
  //       lat: data[i][0],
  //       lng: data[i][1],
  //       alt: data[i][2],
  //     });
  //   }

  //   console.log("lives:", lives);

  //   setLivePoss(lives);
  // }, []);

  // console.log("particleSet:", particleSet);

  return (
    //<div style={{ width: "100vw", height: "100vh" }}>
    <div className="layout">
      <Sidebar selected={selected} />

      {/* <div className="globe-wrapper"> */}
      {paths && paths.length > 0 ? (
        <MyGlobe
          paths={
            selected !== null
              ? [paths.find((b) => b[0].id === selected.id)]
              : []
          }
          livePoss={livePoss}
          selected={selected}
          setSelected={setSelected}
        />
      ) : (
        <div className="loading">Loading balloon data...</div>
      )}
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
