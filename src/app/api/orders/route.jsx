import { createSessionClient, createAdminClient, createUser } from "@/appwrite/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const sessionCookie = cookies().get("session");

  if (!sessionCookie) {
      console.log("Session cookie not found");
      return NextResponse.json({ message: "Session cookie not found" }, { status: 401 });
  }

  try {
      console.log("Session cookie value:", sessionCookie.value);  // Log session value
      
      // Initialize the session client
      const { account, databases } = await createSessionClient(sessionCookie.value);
      console.log("Account Object:", account);
      if (!account) {
        console.error("Account client is undefined.");
        return NextResponse.json({ message: "Account client initialization failed." }, { status: 500 });
    }
      
      // Fetch user and reservation data
      const user = await account.get();
      const { documents: orders, total: amount } = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID,
          process.env.NEXT_PUBLIC_COLLECTION_ORDERS
      );
      // Fetch services from Appwrite database
      const { documents: services } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_SERVICES
      );
      
      console.log("User:", user);
      console.log("Reservation:", orders);
      console.log("Services:", services);

      // Return user and reservation data
      return NextResponse.json({ user, orders, amount, services }, { status: 200 });
  } catch (error) {
      console.error("Detailed Error:", error);
      return NextResponse.json({ message: "Access DENIED", error: error.message }, { status: 500 });
  }
}



export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    // Create the user
    const user = await createUser({ name, email, password, phone });

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
  } catch (error) {
    console.error("Error during signup:", error.message);

    // Handle duplicate user error (Appwrite-specific)
    if (error.code === 409) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create user.", details: error.message }, { status: 500 });
  }
}
