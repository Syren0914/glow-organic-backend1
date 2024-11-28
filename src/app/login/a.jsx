import React from "react";
import { createAdminClient } from "../../appwrite/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import auth from "../../auth";
import { Leaf, Lock } from 'lucide-react'
import Image from 'next/image'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function Page({params}) {
    const user = await auth.getUser();

    if (user) {
        redirect('/');
    }
    

    return (
        <div className="flex items-center justify-center min-h-screen ">
            
            <form id="login-form" action={auth.createSession} className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Login</h3>
                <p className="text-sm text-center text-gray-600 mb-8">Enter Your Information to Login</p>
                
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Enter your email..." 
                        defaultValue={"erdenebatbayar3@gmail.com"} 
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter your password..." 
                        defaultValue={"12345678"} 
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        required
                    />
                </div>
                <div>
                    
                    <input 
                        type="submit" 
                        value="Login" 
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-white hover:text-black transition duration-200 cursor-pointer"
                    />
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Don&apos;t have an account?
                    <a href="/signup" className="inline-block mt-2 py-2 px-4  text-black font-semibold rounded-md hover:text-gray-500 transition duration-200">
                        Sign Up
                    </a>
                    </p>
                </div>
                
            </form>
        </div>
    );
}
