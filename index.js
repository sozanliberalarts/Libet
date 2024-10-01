const express = require("express"),
  fs = require("fs");

const json = JSON.parse(fs.readFileSync("./video.json", "utf8"));
const port = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const data = {head:fs.readFileSync("./templates/head.html","utf8"),header:fs.readFileSync("./templates/header.html","utf8")};
const notFound = (_, res) => res.status(404).render("404.ejs",data);

app.get('/', (_, res) => res.render("search/index.ejs", data));
app.get("/upload",(_, res) => res.render("upload/index.ejs", data));
app.get("/announcements/:name", async(req, res, next) => {
  const videoData = json.find(x => x.title == req.params.name);
  videoData ? res.render("video.ejs",{...data,...videoData}) : next();
}, notFound);

app.get("/api/search",(req, res) => {
  const { type, content } = req.query;
  res.send(["title", "speaker", "tags"].includes(type)?json.filter(x=>x[type].includes(content)).map(x=>({"src":x.src,"title":x.title,"speaker":x.speaker,"date":x.date})):[]);
});
app.post("/api/upload",(req, res) => {
  json.unshift(req.body);
  fs.writeFileSync('./video.json', JSON.stringify(json));
  res.send("");
});
app.use((req, res, next) => {
  const url = __dirname + req.originalUrl;
  fs.existsSync(url) ? res.sendFile(url) : next();
}, notFound);

app.listen(port, () => console.log(`running on ${port}`));