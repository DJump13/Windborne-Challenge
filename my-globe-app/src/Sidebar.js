export default function Sidebar({ clicked }) {
  return (
    <div className="sidebar">
      <h2>WindBorne Balloons</h2>
      <p>{clicked ? clicked.lat : "Select a balloon to see details."}</p>
    </div>
  );
}
