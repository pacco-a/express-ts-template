import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import bcrypt from "bcrypt";
import { getConnection } from "typeorm";
import { User } from "../entity/User";

passport.use(
	new LocalStrategy(async (username, password, done) => {
		const user = await getConnection()
			.getRepository(User)
			.findOne({ where: { username: username } });

		if (!user) {
			return done(null, false, { message: "Pas d'utilisateur trouvé" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (isPasswordValid) {
			return done(null, user);
		} else {
			return done(null, false, { message: "Mot de passe invalide" });
		}
	})
);

passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser((userId, done) => {
	getConnection()
		.getRepository(User)
		.findOne({ where: { id: userId } })
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err);
		});
});
