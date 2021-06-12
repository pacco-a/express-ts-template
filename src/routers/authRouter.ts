import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/authController";

const authController = new AuthController();

export const authRouter = Router();

authRouter.post("/register", authController.postRegister);

authRouter
	.route("/login")
	.post(
		passport.authenticate("local", {
			failureFlash: true,
			successFlash: true,
			failureRedirect: "/auth/login",
			successRedirect: "/auth/login",
		})
	)
	.get(authController.getLogin);

authRouter.post("/lougout", authController.postLogout);
