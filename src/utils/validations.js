export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const validateEmail = (email) => {
  if (!EMAIL_REGEX.test(email)) return 'Ingresá un email válido.';
  return '';
};

export const validateName = (name) => {
  if (!name.trim()) return 'El nombre no puede estar vacío.';
  if (name.length > 30) return 'El nombre no puede superar los 30 caracteres.';
  return '';
};

export const validatePassword = (password) => {
  if (!PASSWORD_REGEX.test(password)) {
    return 'La contraseña debe tener 8+ caracteres, mayúscula, minúscula, número y carácter especial.';
  }
  return '';
};

export const validatePasswordMatch = (password, repeatPassword) => {
  if (password !== repeatPassword) return 'Las contraseñas no coinciden.';
  return '';
};