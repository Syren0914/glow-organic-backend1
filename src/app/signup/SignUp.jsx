"use client"
import { redirect } from "next/dist/server/api-utils";
import { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // phone: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("User created successfully!");
        
      } else {
        setMessage(data.error || "Failed to create user.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        id="signup-form" 
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Sign Up</h3>
        <p className="text-sm text-center text-gray-600 mb-8">Create an account to get started</p>
        
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name..." 
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email..." 
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        {/* <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">Phone:</label>
          <input 
            type="text" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number..." 
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div> */}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password..." 
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        <div className="mb-4">
          <input 
            type="submit" 
            value="Sign Up" 
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-white hover:text-black transition duration-200 cursor-pointer"
          />
        </div>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <a href="/login" className="inline-block mt-2 py-2 px-4 text-black font-semibold rounded-md hover:text-gray-500 transition duration-200">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
