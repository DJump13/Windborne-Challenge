import "./App.css";

function Sidebar({ selected }) {
  return (
    <div className="sidebar">
      <h2>WindBorne Balloons</h2>
      Yellow lines represent 24hr balloon path
      <p>Heatmap represents relative ozone levels</p>
      <div>
        {selected ? (
          <div>
            <h3>Balloon {selected.id}</h3>
            <table>
              <tbody>
                <tr>
                  <td>Latitude</td>
                  <td>{selected.lat}°</td>
                </tr>
                <tr>
                  <td>Longitude </td>
                  <td>{selected.lng}°</td>
                </tr>
                <tr>
                  <td>Altitude</td>
                  <td>{selected.alt.toFixed(2)} km</td>
                </tr>
                <tr>
                  <td>UV Index ≈</td>
                  <td>
                    {selected?.uvi != null ? selected.uvi.toFixed(3) : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>Ozone</td>
                  <td>{selected?.ozone != null ? selected.ozone : "N/A"} DU</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>Select a balloon to see details.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
