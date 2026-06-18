import * as z from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z\sА-Яа-яЁё]+$/),
  email: z.email(),
  password: z
    .string()
    .min(6)
    .regex(/^[A-Za-z0-9!@#$%^&*()_\-+=.?]+$/),
});

const signInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6)
    .regex(/^[A-Za-z0-9!@#$%^&*()_\-+=.?]+$/),
});

const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6)
    .regex(/^[A-Za-z0-9!@#$%^&*()_\-+=.?]+$/),
  newPassword: z
    .string()
    .min(6)
    .regex(/^[A-Za-z0-9!@#$%^&*()_\-+=.?]+$/),
});

const resetPasswordSchema = z.object({
  email: z.email().optional(),
  newPassword: z
    .string()
    .min(6)
    .regex(/^[A-Za-z0-9!@#$%^&*()_\-+=.?]+$/)
    .optional(),
});

export function validateCreateAccountInputs(registerData: z.output<typeof registerSchema>) {
  return registerSchema.safeParse(registerData);
}

export function validateSignInInputs(signInData: z.output<typeof signInSchema>) {
  return signInSchema.safeParse(signInData);
}

export function validateChangePasswordInputs(
  changePasswordData: z.output<typeof changePasswordSchema>,
) {
  return changePasswordSchema.safeParse(changePasswordData);
}

export function validateResetPasswordInputs(
  resetPasswordData: z.output<typeof resetPasswordSchema>,
) {
  return resetPasswordSchema.safeParse(resetPasswordData);
}
