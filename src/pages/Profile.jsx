import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }

                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("Error loading profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="animate-pulse text-xl text-blue-600 font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {userData?.name || 'User Profile'}
                                </h1>
                                <p className="text-blue-100">{userData?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {userData && (
                        <div className="p-8">
                            {/* Personal Information Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-700 ml-3">Contact Info</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="text-gray-700">{userData.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="text-gray-700">{userData.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-700 ml-3">Location</h2>
                                    </div>
                                    <p className="text-gray-700">{userData.location}</p>
                                </div>
                            </div>

                            {/* Children Section */}
                            <div>
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-700 ml-3">Children</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {userData.kids.map((kid, index) => (
                                        <div
                                            key={index}
                                            className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-800">{kid.name}</h3>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                                    {kid.age} years
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile; 