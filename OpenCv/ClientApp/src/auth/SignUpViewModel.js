import SignUpModel from './SignUpModel';

class SignUpViewModel {
    constructor(signUpModel) {
        this.signUpModel = signUpModel;
    }

    async signUp() {
        const domain = 'http://localhost:5174/api/User/signUp'; // Your backend endpoint

        try {
            const response = await fetch(domain, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.signUpModel.name,
                    surname: this.signUpModel.surname,
                    email: this.signUpModel.email,
                    password: this.signUpModel.password,
                    confirmPassword: this.signUpModel.confirmPassword
                })
            });

            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                // Parse JSON if response is JSON
                result = await response.json();
            } else {
                // Handle plain text response
                result = await response.text();
            }

            if (!response.ok) {
                throw new Error(result || 'Network response was not ok.');
            }

            return { success: true, result };

        } catch (error) {
            return { success: false, errors: [error.message] };
        }
    }
}

export default SignUpViewModel;
