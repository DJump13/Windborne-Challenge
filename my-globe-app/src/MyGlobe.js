import Globe from "react-globe.gl";
import React, { useState } from "react";

function MyGlobe({ paths, livePoss, selected, setSelected }) {
  const [ozoneData, setOzoneData] = useState([
    { lat: -1000, lng: -2000, uv: 0, ozone: 80 },
    { lat: 1000, lng: 2000, uv: 0, ozone: 600 },
  ]);

  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="white" cx="14" cy="14" r="7"></circle>
    </svg>`;

  //   console.log("paths:", paths);
  //   console.log("livePoss:", livePoss);

  return (
    <div className="globe-area">
      <div className="globe-wrapper">
        <Globe
          width={window.innerWidth}
          height={window.innerHeight}
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
          //
          pathsData={paths}
          pathPointLat={(d) => d.lat}
          pathPointLng={(d) => d.lng}
          pathPointAlt={(d) => d.alt / 6371} // normalize by earth radius
          pathStroke={1.5}
          //
          heatmapsData={[ozoneData]}
          heatmapPointLat={(d) => d.lat}
          heatmapPointLng={(d) => d.lng}
          //   heatmapPointWeight={(d) => {
          //     const norm = (d.ozone - 80) / (600 - 80); // normalize between 80 and 600 DU
          //     return Math.max(0, Math.min(1, Math.pow(norm, 1.3)));
          //   }}
          heatmapPointWeight={(d) => d.ozone}
          heatmapTopAltitude={0.1}
          heatmapBandwidth={5}
          heatmapsTransitionDuration={2000}
          enablePointerInteraction={false}
          //
          htmlElementsData={livePoss || []}
          htmlLat={(d) => d.lat}
          htmlLng={(d) => d.lng}
          htmlAltitude={(d) => d.alt / 6371} // normalize by earth radius
          htmlElement={(d) => {
            const el = document.createElement("div");
            el.innerHTML = markerSvg;

            // element sizing
            el.style.width = "18px";
            el.style.height = "18px";

            el.style.color =
              selected && selected.id === d.id ? "red" : "silver";
            el.style.position = "absolute";
            el.style.cursor = "pointer";
            el.style.transition = "opacity 250ms";
            el.onclick = (e) => {
              e.stopPropagation();
              setSelected(d);

              fetch(
                `http://localhost:4000/openuv?lat=${d.lat.toFixed(
                  2
                )}&lng=${d.lng.toFixed(2)}`
              )
                .then((res) => res.json())
                .then((json) => {
                  //   console.log(json.result);
                  setSelected((prev) => {
                    return {
                      ...prev,
                      uvi:
                        json.result.uv * Math.exp(0.000105 * prev.alt * 1000), // adjust UV index for altitude
                      ozone: json.result.ozone,
                    };
                  });

                  setOzoneData((prev) => {
                    const exists = prev.some(
                      (p) => p.lat === d.lat && p.lng === d.lng
                    );

                    if (exists) return prev;
                    return [
                      ...prev,
                      {
                        lat: d.lat,
                        lng: d.lng,
                        uv: json.result.uv,
                        ozone: json.result.ozone,
                      },
                    ];
                  });
                  //   console.log("Updated ozoneData:", ozoneData);
                })
                .catch((error) => console.error(error));

              //   console.log("Clicked marker:", d);
            };

            return el;
          }}
          htmlElementVisibilityModifier={(el, isVisible) => {
            el.style.opacity = isVisible ? 1 : 0;
            el.style.pointerEvents = isVisible ? "auto" : "none";
          }}
        />
      </div>
    </div>
  );
}

export default MyGlobe;
