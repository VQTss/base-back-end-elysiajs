
import { emailRegex, usernameRegex, passwordRegex, phoneRegex } from '../constants/regex';



class RegexValidator {
    public static email(value: string): boolean {
        
        return emailRegex.test(value);
    }

    public static username(value: string): boolean {
        return usernameRegex.test(value);
    }

    public static password(value: string): boolean {
        return passwordRegex.test(value);
    }

    public static phone(value: string): boolean {
        return phoneRegex.test(value);
    }
}

export default RegexValidator;