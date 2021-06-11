import express, { Application } from "express";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { authRouter } from "./routers/authRouter";

const app: Application = express();

app.get("/", (req, res) => {
	res.send("Hello World !");
});

app.use(express.json());

createConnection().then(async (connection) => {
	app.use("/auth", authRouter);

	app.post("/testo", async (req, res) => {
		const newUser = connection.getRepository(User).create({
			username: "Pacco",
			password: "Pacco",
		});

		const savedUser = await connection.getRepository(User).save(newUser);

		res.json(savedUser);
	});

	app.listen(5000, () => {
		console.clear();
		console.log(`Server running on localhost:${5000}`);
	});
});
