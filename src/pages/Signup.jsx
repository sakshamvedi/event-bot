import React, { useState } from 'react';
import { db } from './firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        kids: [],
    });

    const [kidDetails, setKidDetails] = useState([{ name: '', age: '' }]);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleKidChange = (index, field, value) => {
        const updatedKids = kidDetails.map((kid, i) =>
            i === index ? { ...kid, [field]: value } : kid
        );
        setKidDetails(updatedKids);
        setFormData({ ...formData, kids: updatedKids });
    };

    const addKid = () => {
        setKidDetails([...kidDetails, { name: '', age: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Save form data to Firestore
            const docRef = await addDoc(collection(db, 'registrations'), formData);
            console.log('Document written with ID:', docRef.id);
            setSuccess(true);
            setLoading(false);

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                location: '',
                kids: [],
            });
            setKidDetails([{ name: '', age: '' }]);
            navigate('/events');
            localStorage.setItem('isuserregistered', 'true');

        } catch (e) {
            console.error('Error adding document:', e);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Event Sign-Up</h1>
                {success && (
                    <div className="text-green-500 text-center mb-4">
                        Registration successful!
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter your location"
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    {/* Children Details */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Children Details</label>
                        {kidDetails.map((kid, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Child's Name"
                                    value={kid.name}
                                    onChange={(e) =>
                                        handleKidChange(index, 'name', e.target.value)
                                    }
                                    className="flex-1 border border-gray-300 rounded-md p-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Age"
                                    value={kid.age}
                                    onChange={(e) =>
                                        handleKidChange(index, 'age', e.target.value)
                                    }
                                    className="w-20 border border-gray-300 rounded-md p-2"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addKid}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Add Another Child
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Register Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
