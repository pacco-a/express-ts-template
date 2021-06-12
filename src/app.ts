import express, { Application } from "express";
import passport from "passport";
import { createConnection, getConnection } from "typeorm";
import { User } from "./entity/User";
import { authRouter } from "./routers/authRouter";
import flash from "connect-flash";
import session from "express-session";
import { Session } from "./entity/Session";
import { TypeormStore } from "connect-typeorm/out";

createConnection().then(async (connection) => {
	const app: Application = express();

	app.get("/", (req, res) => {
		res.send("Hello World !");
	});

	app.use(express.json());

	const sessionMiddleware = session({
		secret: "8C495G$7'8-9yP20!6Qt0~-ABD852M", //TODO mettre dans .env
		resave: false,
		saveUninitialized: false,
		store: new TypeormStore({
			cleanupLimit: 2,
			ttl: 86400,
		}).connect(getConnection().getRepository(Session)),
		cookie: { maxAge: 36000000 },
	});
	app.use(sessionMiddleware);

	require("./configs/passportConfig");
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
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
