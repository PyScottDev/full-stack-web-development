import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: process.env.PG_PASSWORD,
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];
async function readList() {
  let result = await db.query(
    "SELECT id, title FROM permalist ORDER BY id ASC"
  );
  return result.rows;
}

app.get("/", async (req, res) => {
  const items = await readList();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query(
    "INSERT INTO permalist (title) VALUES ($1)",
    [item]
  );
  //items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const { updatedItemId, updatedItemTitle } = req.body;
  await db.query(
    "UPDATE permalist SET title = $1 WHERE id = $2",
    [updatedItemTitle, updatedItemId]
  );
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const deleteItemId = Number(req.body.deleteItemId);
  await db.query(
    "DELETE FROM permalist WHERE id = $1",
    [deleteItemId]
  );
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
