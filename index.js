const express = require("express"),
  fs = require("fs"),
  path = require("path"),
  RateLimit = require("express-rate-limit");

const SAFE_ROOT = path.resolve(__dirname, 'public');

const json = JSON.parse(fs.readFileSync("./video.json", "utf8"));
const port = 3000;
const app = express();

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);

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
  const requestedPath = path.resolve(SAFE_ROOT, '.' + req.originalUrl);
  if (requestedPath.startsWith(SAFE_ROOT) && fs.existsSync(requestedPath)) {
    res.sendFile(requestedPath);
  } else {
    next();
  }
}, notFound);

app.listen(port, () => console.log(`running on ${port}`));