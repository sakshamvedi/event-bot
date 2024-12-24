import React, { useState } from 'react';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                        <a
                            href="#"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            About
                        </a>
                        <a
                            href="events"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Events
                        </a>
                        <a
                            href="tickets"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Tickets
                        </a>
                        <a
                            href="/contact"
                            className="px-3 py-2 rounded-md text-sm font-medium bg-blue-00"
                        >
                            Sign Up
                        </a>
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
                        <a
                            href="#"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                        >
                            About
                        </a>
                        <a
                            href="#events"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                        >
                            Events
                        </a>
                        <a
                            href="#contact"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
