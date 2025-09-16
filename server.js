const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts")

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts)
app.set("layout", "layouts/layout")


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { 
    title: "Accueil",
    message: "Bienvenue chez CSE Motors 🚗"
  });
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
