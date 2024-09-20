class SignUpModel {
    constructor(name, surname, email, password, confirmPassword) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    // Method to validate the data
    validate() {
        const errors = [];

        if (!this.name || this.name.length > 50) {
            errors.push("Name is required and must be less than 50 characters.");
        }

        if (!this.surname || this.surname.length > 50) {
            errors.push("Surname is required and must be less than 50 characters.");
        }

        if (!this.email || !this.validateEmail(this.email)) {
            errors.push("A valid email address is required.");
        }

        if (!this.password || this.password.length < 6) {
            errors.push("Password is required and must be at least 6 characters long.");
        }

        if (this.password !== this.confirmPassword) {
            errors.push("Passwords do not match.");
        }

        return errors;
    }

    // Helper method to validate email format
    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
}

export default SignUpModel;
