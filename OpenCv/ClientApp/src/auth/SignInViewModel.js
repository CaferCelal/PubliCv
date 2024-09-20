import SignInModel from './SignInModel';

class SignInViewModel {
    constructor(signInModel) {
        this.signInModel = signInModel;
    }

    async  TestRequest() {
        try {
            const response = await fetch('https://localhost:44461/api/Sign/test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check if the response is OK
            if (response.ok) {
                const data = await response.json();
                console.log(data); // Log the result to the console
            } else {
                console.error('Failed to fetch: ', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while fetching:', error);
        }
    }


    async signIn() {
        const domain = 'https://localhost:44461/api/Sign/signIn'; // Backend endpoint

        try {
            const response = await fetch(domain, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.signInModel.email,
                    password: this.signInModel.password
                })
            });

            // Handle potential content types and parse accordingly
            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json(); // Parse JSON if available
            } else if (contentType && contentType.includes('text/plain')) {
                result = await response.text(); // Handle plain text response
            } else {
                throw new Error('Unsupported response type from server.');
            }

            // Check for a non-OK response
            if (!response.ok) {
                return { success: false, errors: result.errors || [result] };
            }

            // Return successful result
            return { success: true, result };

        } catch (error) {
            // Catch and return any errors that occur during the request
            return { success: false, errors: [error.message] };
        }
    }
}

export default SignInViewModel;
