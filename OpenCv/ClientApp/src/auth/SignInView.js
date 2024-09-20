import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './SignInView.css'; // Ensure this CSS file is imported
import invisibleIcon from './icons/invisible.png'; // Import your invisible icon
import visibleIcon from './icons/visible.png'; // Import your visible icon
import SignInModel from './SignInModel';
import SignInViewModel from './SignInViewModel'; // Ensure SignInViewModel is imported correctly
import ToastAuth from './ToastAuth'; // Import the ToastAuth component

const SignInView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // 'success' or 'error'
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Clear toast message after 3 seconds automatically
        if (toastMessage) {
            const timeout = setTimeout(() => {
                setToastMessage('');
                setToastType('');
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [toastMessage]);

    const handleSignIn = async () => {
        console.log('Sign in clicked');

        // Create a SignInViewModel instance
        const signInViewModel = new SignInViewModel();

        // Call the TestRequest function from SignInViewModel
        try {
            const result = await signInViewModel.TestRequest();

            if (result) {
                console.log('Test request successful:', result);
            } else {
                console.error('Test request failed.');
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }

        /*
        // Existing sign-in logic
        const signInModel = new SignInModel(email, password);
    
        if (!email || !password) {
            triggerToast('Both email and password are required.', 'error');
            return;
        }
    
        if (!isValidEmail(email)) {
            triggerToast('Please enter a valid email address.', 'error');
            return;
        }
    
        try {
            const result = await signInViewModel.signIn();
    
            if (result.success) {
                console.log('Sign in successful:', result.result);
                triggerToast('Sign in successful!', 'success');
                setTimeout(() => navigate('/dashboard'), 3000);
            } else {
                handleSignInError(result.errors);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            triggerToast('An unexpected error occurred. Please try again later.', 'error');
        }
        */
    };


    const handleSignInError = (errors) => {
        // Handle unauthorized error specifically
        if (errors.some(error => error.toLowerCase().includes('unauthorized'))) {
            triggerToast('Unauthorized: Invalid email or password.', 'error');
        } else {
            // Format other errors into a readable message
            const errorMessages = Array.isArray(errors)
                ? errors.join(' ')
                : Object.entries(errors).flatMap(([field, messages]) => `${field}: ${messages}`).join(' ');
            triggerToast(`Sign in failed. ${errorMessages}`, 'error');
        }
    };

    const triggerToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSignUp = () => navigate('/signup');

    const forgotPassword = () => {
        console.log('Forgot password clicked');
        navigate('/forgot-password');
    };

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Welcome!</h2>

                {/* Toast notification */}
                <ToastAuth message={toastMessage} type={toastType} />

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <div className="password-input-container">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                        <img
                            src={isPasswordVisible ? visibleIcon : invisibleIcon}
                            alt="Toggle visibility"
                            className="visibility-icon"
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                </div>

                <div className="button-group">
                    <button onClick={handleSignIn}>Sign In</button>
                    <button onClick={handleSignUp}>Sign Up</button>
                </div>

                <div className="forgot-password">
                    <a href="#" onClick={forgotPassword}>Forgot password?</a>
                </div>
            </div>
        </div>
    );
};

export default SignInView;
