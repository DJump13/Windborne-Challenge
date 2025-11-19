const express = require("express");

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

//FIXME: make dynamic to fetch different balloon data based on id param
app.get("/balloons", async (req, res) => {
  try {
    //const id = req.params.id;
    const response = await fetch(
      `https://a.windbornesystems.com/treasure/01.json`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
