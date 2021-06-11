import express, { Application } from "express";

const app: Application = express();

app.get("/", (req, res) => {
	res.send("Hello World !");
});

app.listen(5000, () => {
	console.clear();
	console.log(`Server running on localhost:${5000}`);
});
