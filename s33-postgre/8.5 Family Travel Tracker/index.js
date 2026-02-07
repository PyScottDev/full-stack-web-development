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
  database: "World",
  password: process.env.PG_PASSWORD,
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

// let users = [
//   { id: 1, name: "Angela", color: "teal" },
//   { id: 2, name: "Jack", color: "powderblue" },
// ];

async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  const resultColor = await db.query(
    "SELECT color FROM users WHERE id = $1",
    [currentUserId]
  );
  const color = resultColor.rows[0].color;
  return {
    countries,
    color
  };
}

app.get("/", async (req, res) => {
  const userResult = await db.query("SELECT * FROM users");
  let users = [];
  userResult.rows.forEach((user) => {
  users.push(user);
})
  const { countries, color } = await checkVisisted();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: color,
  });
});

app.post("/add", async (req, res) => {
  console.log("ADD for user:", currentUserId, "input:", req.body.country);
  const input = req.body["country"];
  console.log("RAW:", JSON.stringify(req.body.country), "len:", req.body.country.length); //debugging Morocco


  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );
    if (result.rows.length === 0) {
      console.log("No country match for:", input);
      return res.redirect("/");
    }

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    return res.render("new.ejs");
  }
  currentUserId = Number(req.body["user"]);
  res.redirect("/");
  });
  
app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const newName = req.body["name"];
  const newColor = req.body["color"];
  const result = await db.query("INSERT INTO users(name, color) VALUES($1, $2) RETURNING *",
  [newName, newColor]
  )
  const newUser = result.rows[0];
  currentUserId = newUser.id
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
