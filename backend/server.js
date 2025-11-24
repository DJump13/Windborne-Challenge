const express = require("express");
const cron = require("node-cron");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = 4000;

// CACHE
let hourlySnapshots = [];
let latestSnapshot = null;

async function populateLast24Hours() {
  const hours = [...Array(24).keys()]; // 0..23
  const snapshots = [];

  for (const h of hours) {
    const hourStr = String(h).padStart(2, "0");
    try {
      const res = await fetch(
        `https://a.windbornesystems.com/treasure/${hourStr}.json`
      );
      if (!res.ok) continue;

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        snapshots.push(data);
      }
    } catch (err) {
      console.warn(`Error fetching hour ${hourStr}:`, err);
    }
  }

  if (snapshots.length > 0) {
    hourlySnapshots = snapshots.reverse(); //oldest to newest
    latestSnapshot = hourlySnapshots[hourlySnapshots.length - 1];
    // console.log("Populated last 24 hours of data");
  } else {
    console.warn("No valid data fetched for the last 24 hours");
  }
}

async function updateLatestHour() {
  try {
    const response = await fetch(
      `https://a.windbornesystems.com/treasure/00.json`
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch hour ${hourStr}: ${response.statusText}`
      );

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      latestSnapshot = data; //update latest valid data
      hourlySnapshots.push(latestSnapshot); //add to front
      if (hourlySnapshots.length > 24) hourlySnapshots.shift();

      // console.log("Latest hour data updated: ", latestSnapshot);
      // console.log("Hourly snapshots length:", hourlySnapshots.length);
    }
  } catch (err) {
    console.warn(`Error fetching hour ${hourStr}:`, err);
  }
}

///////////////////////

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/latest", (req, res) => {
  if (!latestSnapshot)
    return res.status(500).json({ error: "No latest snapshot available" });
  res.json(latestSnapshot);
});

app.get("/paths", (req, res) => {
  const balloonCount = hourlySnapshots[0]?.length || 0;

  const paths = Array.from({ length: balloonCount }, () => []);

  for (const snapshot of hourlySnapshots) {
    snapshot.forEach((pos, i) => {
      if (!pos || pos.length < 3) {
        // skip this hour for this balloon
        return;
      }

      paths[i].push({
        id: i,
        lat: Number(pos[0]),
        lng: Number(pos[1]),
        alt: Number(pos[2]) / 6371, // normalize by earth radius
      });
    });
  }

  res.json(paths);
});

app.get("/openuv", (req, res) => {
  var myHeaders = new Headers();
  myHeaders.append("x-access-token", process.env.OPENUV_API_KEY);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const lat = req.query.lat;
    const lng = req.query.lng;

    fetch(
      `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}&alt=&dt=`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => res.send(result))
      .catch((error) => {
        console.log("error", error);
        res.status(500).json({ error: "Error fetching OpenUV data" });
      });
  } catch (err) {
    console.warn(`Error in /openuv endpoint:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------
// Serve React frontend
// ----------------------
app.use(express.static(path.join(__dirname, "../my-globe-app/build"))); // adjust path if needed

app.get("*", (req, res) => {
  // any route not handled by API will serve React's index.html
  res.sendFile(path.join(__dirname, "../my-globe-app/build", "index.html"));
});

(async () => {
  await populateLast24Hours();
  // console.log(hourlySnapshots.length, " hourly snapshots loaded");

  cron.schedule("0 * * * *", () => {
    console.log("Scheduled task: updating latest hour data");
    updateLatestHour();
  });

  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
})();
