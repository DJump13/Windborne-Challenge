function Sidebar({ selected }) {
  return (
    <div className="sidebar">
      <h2>WindBorne Balloons</h2>
      <div>
        {selected ? (
          <div>
            <p>Latitude: {selected.lat}°</p>
            <p>Longitude: {selected.lng}°</p>
            <p>Altitude: {selected.alt.toFixed(2)} km</p>
          </div>
        ) : (
          "Select a balloon to see details."
        )}
      </div>
    </div>
  );
}

export default Sidebar;
