import React, { useState, useEffect } from "react";
import { db } from "./firebase.config";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { Loader2, Calendar, MapPin, Clock, X, Ticket } from "lucide-react";
import { auth } from "./firebase.config";
import { useNavigate } from "react-router-dom";

function Tickets() {
    const [userTickets, setUserTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchUserTickets(currentUser.uid);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchUserTickets = async (userId) => {
        try {
            const userTicketsRef = doc(db, "userTickets", userId);
            const userTicketsDoc = await getDoc(userTicketsRef);

            if (userTicketsDoc.exists()) {
                const ticketsData = userTicketsDoc.data();
                setUserTickets(ticketsData.tickets || []);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Tickets</h1>
                        <p className="text-gray-600 mt-2">Manage your event tickets</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <Ticket className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-700">
                            {userTickets.length} Tickets
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="text-gray-600">Loading your tickets...</p>
                        </div>
                    </div>
                ) : userTickets.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                        <div className="flex justify-center mb-4">
                            <Ticket className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No Tickets Found
                        </h3>
                        <p className="text-gray-600">
                            You haven't booked any event tickets yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userTickets.map((ticket, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {ticket.eventName}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {ticket.ticketId}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${ticket.type === "Paid"
                                            ? "bg-purple-100 text-purple-600"
                                            : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {ticket.type}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">
                                            Purchased: {formatDate(ticket.purchaseDate)}
                                        </span>
                                    </div>
                                    {ticket.type === "Paid" && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-sm font-medium">
                                                Price: ${ticket.price}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedTicket(ticket);
                                        setShowTicketModal(true);
                                    }}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    View Ticket
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Ticket Details Modal */}
                {showTicketModal && selectedTicket && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md m-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Ticket Details
                                </h2>
                                <button
                                    onClick={() => setShowTicketModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex justify-center mb-6">
                                {/* <QRCode
                                    value={selectedTicket.ticketId}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                /> */}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {selectedTicket.eventName}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {selectedTicket.description}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Ticket ID</span>
                                        <span className="font-medium">{selectedTicket.ticketId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Type</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${selectedTicket.type === "Paid"
                                            ? "bg-purple-100 text-purple-600"
                                            : "bg-green-100 text-green-600"
                                            }`}>
                                            {selectedTicket.type}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Purchase Date</span>
                                        <span className="font-medium">
                                            {formatDate(selectedTicket.purchaseDate)}
                                        </span>
                                    </div>
                                    {selectedTicket.type === "Paid" && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Price</span>
                                            <span className="font-medium">
                                                ${selectedTicket.price}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Download Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tickets;