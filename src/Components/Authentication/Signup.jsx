import React, { useState } from 'react';
import { Train, Eye, EyeOff, UserPlus } from 'lucide-react';
import platformbcg from './platformbcg.png';
import districtsByState from './Data.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const indianStates = Object.keys(districtsByState);

export default function Signup() {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleStateChange = (e) => {
        const newState = e.target.value;
        console.log('State changed to:', newState); // Debug log
        setState(newState);
        setDistrict(''); // Reset district selection when state changes
    };

    const getDistrictsForState = (selectedState) => {
        if (!selectedState || !districtsByState[selectedState]) {
            return [];
        }
        return districtsByState[selectedState];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        e.preventDefault();
        setTimeout(() => {
            toast.success('Signup Successfully');
        }, 500);
        setTimeout(() => {
            navigate('/login');
        }, 1500);
        // try {
        //   const response = await axios.post('/api/signup', {
        //     employeeId,
        //     password,
        //     state,
        //     district
        //   });
        //   if (response.status.code === 0) {
        //     toast.success("Account Created Successfully");
        //     navigate('/');
        //   } else {
        //     toast.error("Signup failed. Please try again.");
        //   }
        // } catch (error) {
        //   toast.error("Signup failed. Please try again later.");
        //   console.error('Signup error:', error);
        // }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden"
            style={{ backgroundImage: `url(${platformbcg})`, backgroundSize: 'cover' }}
        >
            <Toaster position="top-right" />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-4 px-4">
                {/* Header section */}
                <div className="text-center mb-2">
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

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 w-full max-w-md"
                >
                    <div className="text-center mb-6">
                        <div className="bg-blue-600 p-2 rounded-lg inline-block mb-3">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Create Platform Control Account</h3>
                        <p className="text-gray-400 text-sm">Register for the Railway Platform Management System</p>
                    </div>

                    <div className="space-y-4">
                        {/* Employee ID */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Employee ID</label>
                            <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="Enter your employee ID"
                                required
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition duration-200"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition duration-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* State Dropdown */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">State</label>
                            <select
                                value={state}
                                onChange={handleStateChange}
                                required
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                            >
                                <option value="" disabled>
                                    Select your state
                                </option>
                                {indianStates.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* District Dropdown */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">District</label>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                required
                                disabled={!state}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="" disabled>
                                    {state ? 'Select your district' : 'Select state first'}
                                </option>
                                {getDistrictsForState(state).map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                        Create Account
                    </button>
                </form>

                {/* Footer warning */}
                <div className="mt-8 text-center max-w-md">
                    <p className="text-gray-400 text-xs flex items-center justify-center">
                        <span className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center mr-2 text-xs">!</span>
                        This system is for authorized railway personnel only. All access is monitored and logged.
                    </p>
                </div>
            </div>
        </div>
    );
}
