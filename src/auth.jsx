import { cookies } from "next/headers";
import { createSessionClient } from "./appwrite/config";
import { createAdminClient } from "./appwrite/config";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const auth = {
    user: null,
    sessionCookie: null,
    
    getUserClient: async () => {
        try {
            const { account } = await createSessionClient();
            auth.user = await account.get();
            return auth.user; // Returns the user object
        } catch (error) {
            console.error("Client-side user fetch error:", error);
            return null;
        }
    },
    
    getUser: async () => {
        auth.sessionCookie = cookies().get('session');
        try {
            const { account } = await createSessionClient(auth.sessionCookie.value);
            auth.user = await account.get();
            
            
        } catch (error) {
            console.error(error);
            auth.user = null;
            auth.sessionCookie = null;
        }
        return auth.user;
    },

    createSession: async (formData) => {
        "use server";
        const data = Object.fromEntries(formData);
        const { email, password } = data;
        let session; 
        try {
            const { account } = await createAdminClient();
            session = await account.createEmailPasswordSession(email, password);
        } catch (error) {
            
            console.error("Login error:", error);
            return { success: false, message: "Invalid credentials" };
        }
        
        cookies().set('session', session.secret, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            expires: new Date(session.expire),
            path: '/'
        });

        // Get the user info to check if they are the admin
        const { account: accountClient } = await createSessionClient(session.secret);
        const user = await accountClient.get();

        // Redirect to the admin dashboard if the user is an admin
        if (user.email === 'erdenebatbayar3@gmail.com') {
            redirect("/dashboard");
        } else {
            redirect("/");
        }
    },

    deleteSession: async () => {
        "use server";
        auth.sessionCookie = cookies().get("session");

        try {
            const { account } = await createSessionClient(auth.sessionCookie.value);
            await account.deleteSession('current');
        } catch (error) {
            console.error(error);
        }

        cookies().delete('session');
        auth.user = null;
        auth.sessionCookie = null;
        redirect("/login");
    }
};

export default auth;
