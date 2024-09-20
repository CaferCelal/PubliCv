import React, { Component } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import './custom.css';
import SignInView from "./auth/SignInView";
import SignUpView from "./auth/SignUpView";

export default class App extends Component {
    render() {
        return (
            <Layout>
                <Routes>
                    {/* Redirect root to /signin */}
                    <Route path="/" element={<Navigate to="/signin" />} />
                    {/* Manually defined routes */}
                    <Route path="/signin" element={<SignInView />} />
                    <Route path="/signup" element={<SignUpView />} />

                    
                </Routes>
            </Layout>
        );
    }
}
