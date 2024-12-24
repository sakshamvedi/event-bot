import React, { useState, useEffect } from "react";
import { db } from "./firebase.config";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    arrayUnion,
} from "firebase/firestore";
import Navbar from "./Navbar";

function Events() {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        name: "",
        description: "",
        type: "Free",
        price: 0,
        tickets: 100,
    });
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = collection(db, "events");
            const eventSnapshot = await getDocs(eventsCollection);
            const eventList = eventSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(eventList);
        };

        fetchEvents();
    }, []);

    const handleCreateEvent = async () => {
        if (!newEvent.name.trim()) return;
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "events"), newEvent);
            setEvents([...events, { id: docRef.id, ...newEvent }]);
            setNewEvent({ name: "", description: "", type: "Free", price: 0, tickets: 100 });
            setLoading(false);
        } catch (e) {
            console.error("Error creating event:", e);
            setLoading(false);
        }
    };

    const handleJoinEvent = async (eventId, userId) => {
        try {
            const eventDoc = doc(db, "events", eventId);
            await updateDoc(eventDoc, {
                joinedUsers: arrayUnion(userId),
            });
            showAlert("Successfully joined the event!");
        } catch (e) {
            console.error("Error joining event:", e);
            showAlert("Failed to join the event.");
        }
    };

    const handleBookTicket = async (eventId) => {
        const eventToUpdate = events.find((event) => event.id === eventId);

        if (eventToUpdate.tickets <= 0) {
            showAlert("No tickets available!");
            return;
        }

        try {
            const eventDoc = doc(db, "events", eventId);
            await updateDoc(eventDoc, {
                tickets: eventToUpdate.tickets - 1,
            });

            // Update the UI
            setEvents(
                events.map((event) =>
                    event.id === eventId
                        ? { ...event, tickets: event.tickets - 1 }
                        : event
                )
            );

            showAlert("Ticket booked successfully!");
        } catch (e) {
            console.error("Error booking ticket:", e);
            showAlert("Error booking ticket.");
        }
    };

    const showAlert = (message) => {
        alert(message); // Custom alert box can be made later as per requirement
    };

    const openModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center p-8 w-[100%] bg-image-url">
                <h1 className="text-2xl font-bold text-center mb-8">Manage Events</h1>

                {/* Create Event Section */}
                <div className="bg-white shadow-md p-6 rounded-md mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Create an Event</h2>
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        className="w-full border p-2 rounded-md mb-4"
                    />
                    <textarea
                        placeholder="Event Description"
                        value={newEvent.description}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, description: e.target.value })
                        }
                        className="w-full border p-2 rounded-md mb-4"
                    />
                    <div className="flex justify-between items-center mb-4">
                        <select
                            value={newEvent.type}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, type: e.target.value })
                            }
                            className="border p-2 rounded-md"
                        >
                            <option value="Free">Free</option>
                            <option value="Paid">Paid</option>
                        </select>
                        {newEvent.type === "Paid" && (
                            <input
                                type="number"
                                placeholder="Ticket Price"
                                value={newEvent.price}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, price: Number(e.target.value) })
                                }
                                className="border p-2 rounded-md"
                            />
                        )}
                    </div>
                    <input
                        type="number"
                        placeholder="Tickets Available"
                        value={newEvent.tickets}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, tickets: Number(e.target.value) })
                        }
                        className="w-full border p-2 rounded-md mb-4"
                    />
                    <button
                        onClick={handleCreateEvent}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Event"}
                    </button>
                </div>

                {/* Events List */}
                <h1 className="text-xl mb-[20px] bold">Recent Events</h1>
                <hr />
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white shadow-lg rounded-md p-4 cursor-pointer hover:shadow-xl transition-all"
                            onClick={() => openModal(event)}
                        >
                            <h3 className="text-xl font-semibold">{event.name}</h3>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span
                                    className={`px-3 py-1 text-sm rounded-md ${event.type === "Paid"
                                        ? "bg-red-100 text-red-500"
                                        : "bg-green-100 text-green-500"
                                        }`}
                                >
                                    {event.type} {event.type === "Paid" && `- $${event.price}`}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {event.tickets} Tickets Left
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Modal for Event Details */}
                {isModalOpen && selectedEvent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-md w-[90%] max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">{selectedEvent.name}</h2>
                            <p className="mb-4">{selectedEvent.description}</p>
                            <div className="flex justify-between items-center mb-4">
                                <span
                                    className={`px-3 py-1 text-sm rounded-md ${selectedEvent.type === "Paid"
                                        ? "bg-red-100 text-red-500"
                                        : "bg-green-100 text-green-500"
                                        }`}
                                >
                                    {selectedEvent.type} {selectedEvent.type === "Paid" && `- $${selectedEvent.price}`}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {selectedEvent.tickets} Tickets Left
                                </span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleBookTicket(selectedEvent.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                >
                                    Book Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Events;
