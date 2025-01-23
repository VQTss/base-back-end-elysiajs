

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9._-]{3,16}$/; // Example: alphanumeric with 3-16 characters
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Minimum 8 chars, 1 letter, 1 number, 1 special char
const phoneRegex = /^[0-9]{10,15}$/; // Example: 10-15 digit numbers


export { emailRegex, usernameRegex, passwordRegex, phoneRegex };