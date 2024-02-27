import express from "express";
import path from "path";
import "dotenv/config.js";

const app = express();
const port = process.env.port || 3000;
const prod = process.env.NODE_ENV === "production";

app.use(express.static(path.join(__dirname, prod ? "./" : "../../", "dist")));
app.use(express.static(path.join(__dirname, "../assets")));

app.get("/", (_req, res) => {
  return res.sendFile(
    path.join(__dirname, prod ? "" : "../../", "dist/index.html")
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🚀`);
});
