import React, { useState } from 'react';
import SignUpModel from './SignUpModel'; // Adjust the path as necessary
import SignUpViewModel from './SignUpViewModel'; // Adjust the path as necessary
import ToastAuth from './ToastAuth'; // Import the ToastAuth component
import './SignUpView.css'; // Import the CSS file

const SignUpView = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // 'success' or 'error'

    // Basic form validation
    const validateForm = () => {
        if (!name || !surname || !email || !password || !confirmPassword) {
            return 'All fields are required.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Invalid email address.';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match.';
        }
        return ''; // No errors
    };

    const handleSignUp = async () => {
        // Validate form data
        const validationError = validateForm();
        if (validationError) {
            setToastMessage(validationError);
            setToastType('error');
            return;
        }

        // Create SignUpModel and ViewModel instances
        const signUpModel = new SignUpModel(name, surname, email, password, confirmPassword);
        const signUpViewModel = new SignUpViewModel(signUpModel);

        try {
            const result = await signUpViewModel.signUp();

            if (result.success) {
                setToastMessage('Sign Up successful!');
                setToastType('success');
            } else {
                setToastMessage(result.errors ? result.errors.join(', ') : 'An unexpected error occurred. Please try again.');
                setToastType('error');
            }
        } catch (error) {
            setToastMessage('An unexpected error occurred. Please try again.');
            setToastType('error');
        }

        // Clear toast message after 3 seconds
        setTimeout(() => {
            setToastMessage('');
            setToastType('');
        }, 3000);
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Sign Up</h2>

                {/* Toast notification */}
                <ToastAuth message={toastMessage} type={toastType} />

                <div className="form-group">
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Surname:
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Enter your surname"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                        />
                    </label>
                </div>
                <div className="button-group">
                    <button onClick={handleSignUp}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpView;
