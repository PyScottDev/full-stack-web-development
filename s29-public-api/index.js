import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
    try {
        const result = await axios.get("https://v2.jokeapi.dev/joke/Any");
        res.render("index.ejs", { content: JSON.stringify(result.data) });
    } catch (error) {
        res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }

     res.render("index.ejs", { content: "Waiting for data..." });
});