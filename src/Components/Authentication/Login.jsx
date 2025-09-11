import React, { useState } from 'react';
import { Train, Eye, EyeOff } from 'lucide-react';
import platformbcg from './platformbcg.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTimeout(() => {
            toast.success('Logged In Successfully');
        }, 500);
        setTimeout(() => {
            navigate('/');
        }, 1500);
        // try {
        //   const response = await axios.post('/api/login', {
        //     employeeId,
        //     password
        //   });
        //   if (response.status.code === 0) {
        //     toast.success('Logged In Successfully');
        //     navigate('/');
        //   } else {
        //     toast.error('Login failed. Please check your credentials.');
        //   }
        // } catch (error) {
        //   toast.error('Login failed. Please try again later.');
        //   console.error('Login error:', error);
        // }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden"
            style={{ backgroundImage: `url(${platformbcg})`, backgroundSize: 'cover' }}
        >
            <Toaster position="top-right" />
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-1 bg-white transform -rotate-45"></div>
                <div className="absolute top-40 right-20 w-24 h-1 bg-white transform rotate-45"></div>
                <div className="absolute bottom-32 left-20 w-40 h-1 bg-white transform -rotate-12"></div>
                <div className="absolute bottom-20 right-10 w-28 h-1 bg-white transform rotate-12"></div>
                <div className="absolute top-60 left-1/3 w-36 h-1 bg-white transform rotate-30"></div>
                <div className="absolute top-80 right-1/3 w-20 h-1 bg-white transform -rotate-30"></div>
            </div>
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                {/* Header section */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-lg mr-4">
                            <Train className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-white">Railway Control System</h1>
                            <p className="text-blue-300 text-sm">Platform Management Division</p>
                        </div>
                    </div>
                </div>
                {/* Platform Controller Access info */}
                <div className="text-center mb-8 max-w-md">
                    <h2 className="text-xl font-semibold text-white mb-2">Platform Controller Access</h2>
                </div>
                {/* Login form */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="bg-blue-600 p-2 rounded-lg inline-block mb-3">
                            <Train className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Platform Control Login</h3>
                        <p className="text-gray-400 text-sm">Access the Railway Platform Management System</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Employee ID
                            </label>
                            <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="Enter your employee ID"
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-6">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition duration-200"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-2.5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            Sign In to Control Panel
                        </button>
                    </form>
                </div>
                {/* Footer warning */}
                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-xs flex items-center justify-center">
                        <span className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center mr-2 text-xs">!</span>
                        This system is for authorized railway personnel only. All access is monitored and logged.
                    </p>
                </div>
                {/* System info */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">© 2025 Railway Authority. All rights reserved.</p>
                    <p className="text-gray-500 text-xs">System Version 2.1.4 | Last Updated: December 2025</p>
                </div>
            </div>
        </div>
    );
}