import type { LoginData, RegisterData } from "../types/auth";

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email é obrigatório";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email inválido";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Senha é obrigatória";
  }
  if (password.length < 6) {
    return "Senha deve ter pelo menos 6 caracteres";
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) {
    return "Nome é obrigatório";
  }
  if (name.length < 2) {
    return "Nome deve ter pelo menos 2 caracteres";
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return "Confirmação de senha é obrigatória";
  }
  if (password !== confirmPassword) {
    return "As senhas não coincidem";
  }
  return null;
};

export const validateLoginForm = (data: LoginData): Partial<LoginData> => {
  const errors: Partial<LoginData> = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

export const validateRegisterForm = (
  data: RegisterData
): Partial<RegisterData> => {
  const errors: Partial<RegisterData> = {};

  const nameError = validateName(data.name);
  if (nameError) {
    errors.name = nameError;
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validateConfirmPassword(
    data.password,
    data.confirmPassword
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return errors;
};
