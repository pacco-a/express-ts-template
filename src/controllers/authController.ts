import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { User } from "../entity/User";
import { validateUserRegister } from "../service/auth";

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

		// TODO hash the password with bcrypt

		// create the user
		const newUser = await getConnection()
			.getRepository(User)
			.save(
				await getConnection().getRepository(User).create({
					username: userRequest.username,
					password: userRequest.password,
				})
			);

		res.json(newUser);
	}
}
