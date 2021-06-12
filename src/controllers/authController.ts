import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { User } from "../entity/User";
import { validateUserRegister } from "../service/auth";
import bcrypt from "bcrypt";
import passport from "passport";

interface IUser {
	username: string;
	password: string;
}

export class AuthController {
	/**
	 * POST : /auth/register
	 */
	public async postRegister({ body }: Request, res: Response) {
		const userRequest: IUser = body;

		// verification user pattern
		const bodyValidationResult = validateUserRegister(userRequest);
		if (bodyValidationResult.error) {
			return res
				.status(400)
				.json({ error: bodyValidationResult.error.message });
		}

		// validate duplicate
		const existingUser = await getConnection()
			.getRepository(User)
			.findOne({ where: { username: userRequest.username } });
		if (existingUser) {
			return res.status(400).json({ error: "user already exists" });
		}

		// hash the password with bcrypt
		const hashSalt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(
			userRequest.password,
			hashSalt
		);

		// create the user
		const newUser = await getConnection()
			.getRepository(User)
			.save(
				await getConnection().getRepository(User).create({
					username: userRequest.username,
					password: hashedPassword,
				})
			);

		res.json(newUser);
	}

	/**
	 * POST : /auth/login
	 */
	public async postLogin(req: Request, res: Response) {
		passport.authenticate("local", function (err, user, info) {
			console.log(`user : ${user}`);

			if (err) {
				return res.send("error");
			}
			if (!user) {
				return res.send("no user");
			}
			req.logIn(user, function (err) {
				if (err) {
					return res.send("error");
				}
				return res.redirect("/users/" + user.username);
			});
		})(req, res);
	}

	/**
	 * GET : /auth/login
	 */
	public async getLogin(req: Request, res: Response) {
		const flashError = req.flash("error");

		// si l'utilisateur a tenté une connexion infructueuse,
		// - il est déconnecté de sa précédente session quoi qu'il arrive.
		if (flashError.length > 0) {
			req.logout();
			return res.json({ error: flashError[0] });
			// sinon, simplement renvoyé l'id de l'utilisateur
		} else {
			return res.json({ id: (req.user as User).id });
		}
	}

	/**
	 * POST: /auth/logout
	 */
	public async postLogout(req: Request, res: Response) {
		req.logout();
		res.json({ success: "L'utilisateur à été deconnecté" });
	}
}
