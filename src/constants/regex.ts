const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // matches all email addresses
const usernameRegex = /^[a-zA-Z0-9._-]{3,16}$/; //  alphanumeric with 3-16 characters
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Minimum 8 chars, 1 letter, 1 number, 1 special char
const phoneRegex = /^[0-9]{10}$/; // 10 digit numbers
const numberRegex = /^\d+$/; // only numbers

export { emailRegex, usernameRegex, passwordRegex, phoneRegex, numberRegex };