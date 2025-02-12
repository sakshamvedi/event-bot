import React, { useState } from 'react';
import { db, auth } from './firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
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

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleStep1Submit = async () => {
        try {
            setLoading(true);
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Store the user ID for step 2
            setFormData(prev => ({
                ...prev,
                userId: userCredential.user.uid
            }));

            setLoading(false);
            nextStep();
        } catch (error) {
            setLoading(false);
            console.error("Error in step 1:", error);
            alert(error.message);
        }
    };

    const handleStep2Submit = async () => {
        try {
            setLoading(true);

            // Create user profile document in Firestore
            await setDoc(doc(db, "users", formData.userId), {
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                location: formData.location,
                kids: kidDetails,
                createdAt: new Date().toISOString()
            });

            setSuccess(true);
            setLoading(false);
            navigate('/'); // or wherever you want to redirect after successful signup
        } catch (error) {
            setLoading(false);
            console.error("Error in step 2:", error);
            alert(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            await handleStep1Submit();
        } else {
            await handleStep2Submit();
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Create a password"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                disabled={loading}
            >
                {loading ? 'Creating Account...' : 'Continue'}
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                </label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                </label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your location"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children Details
                </label>
                {kidDetails.map((kid, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            placeholder="Child's Name"
                            value={kid.name}
                            onChange={(e) => handleKidChange(index, 'name', e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            value={kid.age}
                            onChange={(e) => handleKidChange(index, 'age', e.target.value)}
                            className="w-24 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addKid}
                    className="mt-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    Add Another Child
                </button>
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={prevStep}
                    className="w-1/2 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Complete Registration'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">
                        {step === 1 ? 'Create Account' : 'Complete Your Profile'}
                    </h1>
                    <div className="mt-3 flex justify-center space-x-2">
                        <div className={`h-2 w-16 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-blue-200'}`} />
                        <div className={`h-2 w-16 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-blue-200'}`} />
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    {step === 1 ? renderStep1() : renderStep2()}
                </form>
            </div>
        </div>
    );
}

export default SignUp;
