import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import bcrypt from "bcrypt";

passport.use(
	new LocalStrategy(async (username, password, done) => {
		return done(null, false, { message: "Pas d'utilisateur trouvé" });
	})
);
