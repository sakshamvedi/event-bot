import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Fetch user details from Firestore
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setUserName(userDoc.data().name);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUser(null);
                setUserName('');
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    return (
        <nav className="bg-[#474E93] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold">EventCo</h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-4">
                        <Link
                            to="/"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            About
                        </Link>
                        <Link
                            to="/events"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Events
                        </Link>
                        <Link
                            to="/tickets"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Tickets
                        </Link>

                        {user ? (


                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/profile"
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    Profile
                                </Link>
                                <span className="text-sm font-medium bg-white text-black px-3 py-2 rounded-md">
                                    Hey, {userName}
                                </span>

                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-blue-700">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                        >
                            About
                        </Link>
                        <Link
                            to="/events"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                        >
                            Events
                        </Link>
                        <Link
                            to="/tickets"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                        >
                            Tickets
                        </Link>

                        {user ? (
                            <>
                                <span className="block px-3 py-2 text-base font-medium">
                                    Hey, {userName}
                                </span>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                                >
                                    Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
