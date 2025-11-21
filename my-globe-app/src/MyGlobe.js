import Globe from "react-globe.gl";

function MyGlobe({ paths, livePoss, selected, setSelected }) {
  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="white" cx="14" cy="14" r="7"></circle>
    </svg>`;

  console.log("paths:", paths);
  console.log("livePoss:", livePoss);

  return (
    <div
      className="globe-area"
      //   onClick={() => {
      //     // Reset selection when clicking anywhere on the container
      //     setSelected(null);
      //     console.log("Background clicked");
      //   }}
    >
      <div className="globe-wrapper">
        <Globe
          width={window.innerWidth}
          height={window.innerHeight}
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
          pathsData={paths}
          pathPointLat={(d) => d.lat}
          pathPointLng={(d) => d.lng}
          pathPointAlt={(d) => d.alt / 6371} // normalize by earth radius
          //pathTransitionDuration={2000}
          pathStroke={1.5}
          //   pathColor={"rgba(255, 0, 0, 1)"}
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
              console.log("Clicked marker:", d);
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
