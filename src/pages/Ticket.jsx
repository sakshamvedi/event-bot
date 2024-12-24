import React, { useState, useEffect } from "react";
import { db } from "./firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import Navbar from "./Navbar";

function Tickets() {
    const [userTickets, setUserTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = "USER_ID_HERE"; // Replace with the actual user's ID, which can be fetched after user authentication

    useEffect(() => {
        const fetchUserTickets = async () => {
            try {
                const userRef = collection(db, "users");
                const q = query(userRef, where("userId", "==", userId));
                const userSnapshot = await getDocs(q);
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    const eventsJoined = userData.eventsJoined || [];
                    const eventDetails = await Promise.all(
                        eventsJoined.map(async (eventId) => {
                            const eventRef = collection(db, "events");
                            const eventSnapshot = await getDocs(query(eventRef, where("id", "==", eventId)));
                            return eventSnapshot.docs.map((doc) => doc.data())[0];
                        })
                    );
                    setUserTickets(eventDetails);
                }
                setLoading(false);
            } catch (e) {
                console.error("Error fetching user tickets:", e);
                setLoading(false);
            }
        };

        fetchUserTickets();
    }, [userId]);

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center p-8 w-full">
                <h1 className="text-2xl font-bold text-center mb-8">Your Tickets</h1>

                {loading ? (
                    <p>Loading tickets...</p>
                ) : userTickets.length === 0 ? (
                    <p>You have not joined any events yet.</p>
                ) : (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userTickets.map((ticket, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-md p-4"
                            >
                                <h3 className="text-xl font-semibold">{ticket.name}</h3>
                                <p className="text-sm text-gray-600">{ticket.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span
                                        className={`px-3 py-1 text-sm rounded-md ${ticket.type === "Paid" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"
                                            }`}
                                    >
                                        {ticket.type} {ticket.type === "Paid" && `- $${ticket.price}`}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {ticket.tickets} Tickets Left
                                    </span>
                                </div>
                                <button
                                    className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
                                    onClick={() => alert("Booking more tickets is not allowed in this view.")}>
                                    View Ticket Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tickets;
