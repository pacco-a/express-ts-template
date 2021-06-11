import Joi from "joi";

export const validateUserRegister = (
	userRegisterBody: any
): Joi.ValidationResult => {
	const userRegisterSchema = Joi.object({
		username: Joi.string().min(3).required(),
		password: Joi.string().min(5).required(),
	});

	return userRegisterSchema.validate(userRegisterBody);
};
