// please annotate me
const expr = require("express"),
      app  = expr(),
      serv = require("http").createServer(app),
      io   = require("socket.io")(serv),
      f    = require("fs");
      require("pug");

const rhex  = () => Math.random().toString(16).slice(2, 8),
      read  = loc => JSON.parse(f.readFileSync(`./data/${loc}.json`)),
      write = (dat, loc) => f.writeFileSync(`./data/${loc}.json`, JSON.stringify(dat));

app.set("view engine", "pug");
app.use(expr.static(`${__dirname}/public`));

app.get("/", (req, res) => {
  let usr = req.get("X-Replit-User-Name").toLowerCase();
  if (usr) res.redirect("/chat");
  else res.render("index");
});

app.get("/chat", (req, res) => {
  let usr = req.get("X-Replit-User-Name").toLowerCase();
  if (usr) res.redirect("/chat");
  else res.render("404", { err: 403 });
})

app.get("*", (_, res) => {
  res.status(404).render("404", { err: 404 });
});

/*io.on("connection", sock => {
  // sock garbage
});*/

io.on("connection", sock => {
  sock.on("send", (...args) => {
    sock.emit("push", args);
    let dat = read("msg");
    
dat.push(JSON.parse(`{"user":"${args[0]}","content":"${args[1]}","time":"${Date.now()}"`));
  });
});

serv.listen(6111);