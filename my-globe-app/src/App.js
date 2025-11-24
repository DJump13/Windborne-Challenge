import React, { useState, useEffect } from "react";
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
          uvi: null,
          ozone: null,
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

  return (
    <div className="layout">
      <Sidebar selected={selected} />

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
    </div>
  );
}

export default App;
