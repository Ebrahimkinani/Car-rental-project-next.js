/**
 * Validation functions and schemas
 * Centralized validation logic for forms and data
 */

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation
 * At least 8 characters, one uppercase, one lowercase, one number
 */
export function isValidPassword(password: string): boolean {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return minLength && hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Phone number validation (US format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

/**
 * Credit card validation (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, "");
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Username validation (alphanumeric, 3-20 characters)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate required field
 */
export function isRequired(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
}

/**
 * Validate string length
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Validation result type
 */
export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

/**
 * Login form validation
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(data.email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!isRequired(data.password)) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Registration form validation
 */
export function validateRegisterForm(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(data.username)) {
    errors.username = "Username is required";
  } else if (!isValidUsername(data.username)) {
    errors.username = "Username must be 3-20 alphanumeric characters";
  }

  if (!isRequired(data.email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!isRequired(data.password)) {
    errors.password = "Password is required";
  } else if (!isValidPassword(data.password)) {
    errors.password =
      "Password must be at least 8 characters with uppercase, lowercase, and number";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

