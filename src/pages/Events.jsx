import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase.config";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    arrayUnion,
    getDoc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Ticket, Calendar, Users, AlertCircle, X } from "lucide-react";

function Events() {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        name: "",
        description: "",
        type: "Free",
        price: 0,
        tickets: 100,
    });
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [alert, setAlert] = useState(null);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            if (!user) {
                navigate('/login');
            }
        });

        fetchEvents();

        return () => unsubscribe();
    }, [navigate]);

    const fetchEvents = async () => {
        try {
            const eventsCollection = collection(db, "events");
            const eventSnapshot = await getDocs(eventsCollection);
            const eventList = eventSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(eventList);
        } catch (error) {
            showNotification("Error fetching events", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async () => {
        if (!user) {
            showNotification("Please sign in to create an event", "error");
            return;
        }

        if (!newEvent.name.trim()) return;
        setCreating(true);
        try {
            const eventData = {
                ...newEvent,
                createdBy: user.uid,
                creatorName: user.displayName || 'Anonymous',
                createdAt: new Date().toISOString(),
                attendees: [],
            };

            const docRef = await addDoc(collection(db, "events"), eventData);
            setEvents([...events, { id: docRef.id, ...eventData }]);
            setNewEvent({ name: "", description: "", type: "Free", price: 0, tickets: 100 });
            setShowCreateForm(false);
            showNotification("Event created successfully!", "success");
        } catch (error) {
            showNotification("Error creating event", "error");
        } finally {
            setCreating(false);
        }
    };

    const handleBookTicket = async (eventId) => {
        if (!user) {
            showNotification("Please sign in to book tickets", "error");
            return;
        }

        const eventToUpdate = events.find((event) => event.id === eventId);
        if (eventToUpdate.tickets <= 0) {
            showNotification("No tickets available!", "error");
            return;
        }

        try {
            const eventDoc = doc(db, "events", eventId);
            await updateDoc(eventDoc, {
                tickets: eventToUpdate.tickets - 1,
                attendees: arrayUnion({
                    userId: user.uid,
                    name: user.displayName || 'Anonymous',
                    email: user.email,
                    purchaseDate: new Date().toISOString(),
                })
            });

            const userTicketsRef = doc(db, "userTickets", user.uid);
            const userTicketsDoc = await getDoc(userTicketsRef);

            const ticketData = {
                eventId,
                eventName: eventToUpdate.name,
                purchaseDate: new Date().toISOString(),
                ticketId: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                price: eventToUpdate.price,
                type: eventToUpdate.type,
            };

            if (userTicketsDoc.exists()) {
                await updateDoc(userTicketsRef, {
                    tickets: arrayUnion(ticketData)
                });
            } else {
                await setDoc(userTicketsRef, {
                    tickets: [ticketData],
                    userId: user.uid,
                    email: user.email
                });
            }

            setEvents(
                events.map((event) =>
                    event.id === eventId
                        ? { ...event, tickets: event.tickets - 1 }
                        : event
                )
            );

            showNotification("Ticket booked successfully!", "success");
            setIsModalOpen(false);

        } catch (error) {
            console.error("Error booking ticket:", error);
            showNotification("Error booking ticket", "error");
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!user) {
            showNotification("Please sign in to delete an event", "error");
            return;
        }

        const eventToDelete = events.find((event) => event.id === eventId);
        if (eventToDelete.createdBy !== user.uid) {
            showNotification("You are not authorized to delete this event", "error");
            return;
        }

        try {
            await deleteDoc(doc(db, "events", eventId));
            setEvents(events.filter((event) => event.id !== eventId));
            showNotification("Event deleted successfully!", "success");
        } catch (error) {
            console.error("Error deleting event:", error);
            showNotification("Error deleting event", "error");
        }
    };

    const showNotification = (message, type = "success") => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            {/* Notification Toast */}
            {alert && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
                    <div className={`rounded-lg p-4 shadow-lg ${alert.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        }`}>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            <p className="font-medium">{alert.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Events</h1>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" /> Create Event
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => {
                                    setSelectedEvent(event);
                                    setIsModalOpen(true);
                                }}
                                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {event.name}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {event.description}
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-sm ${event.type === "Paid"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                        }`}>
                                        {event.type} {event.type === "Paid" && `$${event.price}`}
                                    </span>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Ticket className="h-4 w-4" />
                                        <span className="text-sm">{event.tickets} left</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Event Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Create Event</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Event Name"
                                    value={newEvent.name}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <textarea
                                    placeholder="Event Description"
                                    value={newEvent.description}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, description: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32"
                                />
                                <div className="flex gap-4">
                                    <select
                                        value={newEvent.type}
                                        onChange={(e) =>
                                            setNewEvent({ ...newEvent, type: e.target.value })
                                        }
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="Free">Free</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                    {newEvent.type === "Paid" && (
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={newEvent.price}
                                            onChange={(e) =>
                                                setNewEvent({
                                                    ...newEvent,
                                                    price: Number(e.target.value),
                                                })
                                            }
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    )}
                                </div>
                                <input
                                    type="number"
                                    placeholder="Available Tickets"
                                    value={newEvent.tickets}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            tickets: Number(e.target.value),
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <button
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleCreateEvent}
                                    disabled={creating}
                                >
                                    {creating ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Creating...
                                        </div>
                                    ) : (
                                        "Create Event"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Event Details Modal */}
                {isModalOpen && selectedEvent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedEvent.name}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                            <div className="mb-4">

                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${selectedEvent.type === "Paid"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    {selectedEvent.type}{" "}
                                    {selectedEvent.type === "Paid" &&
                                        `$${selectedEvent.price}`}
                                </span>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Ticket className="h-4 w-4" />
                                    <span>{selectedEvent.tickets} tickets left</span>
                                </div>
                            </div>
                            <button
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleBookTicket(selectedEvent.id)}
                                disabled={selectedEvent.tickets <= 0}
                            >
                                {selectedEvent.tickets <= 0 ? "Sold Out" : "Book Ticket"}
                            </button>
                            {/* Delete Event Button */}
                            {selectedEvent.createdBy === user.uid && (
                                <button
                                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors mt-4"
                                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                                >
                                    Delete Event
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events;