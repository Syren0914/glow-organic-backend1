import { Client, Databases, Account } from "node-appwrite";

const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID)
        .setKey(process.env.NEXT_PUBLIC_API_KEY);

    return {
        get account() {
            return new Account(client);
        },

        get databases() {
            return new Databases(client);
        },
    };
};

const createSessionClient = async (session) => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

    if (session) {
        client.setSession(session);
    }

    return {
        get account() {
            return new Account(client);
        },

        get databases() {
            return new Databases(client);
        },
    };
};


// Function to create a new user
const createUser = async ({ name, email, password }) => {
    const { account } = await createAdminClient();
    
    try {
        const user = await account.create("unique()", email, password, name);
        return user;
    } catch (error) {
        console.error("Detailed Error:", error);
        throw new Error("Failed to create user.");
    }
};
const handleBookingSubmit = async ({ selectedServices, selectedDate, selectedTime, userId, userName, userEmail,userPhone }) => {
    try {
      // Initialize client and databases
      const { databases } = await createSessionClient(); // Get session client (for user-related actions)
  
      // Create a booking object
      const bookingData = {
        userId,
        userName,
        userPhone,
        userEmail,
        selectedServices,
        selectedDate: selectedDate.toISOString(), // Convert to ISO string format for consistency
        selectedTime,
        status: "pending",  // You can use a status like 'pending', 'confirmed', etc.
        // createdAt: new Date().toISOString(), // Timestamp for when the booking was created
      };
  
      // Save the booking to Appwrite's database
      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID, // Your database ID
        process.env.NEXT_PUBLIC_COLLECTION_ORDERS, // The collection for bookings
        "unique()",  // Use a unique ID for the document
        bookingData
      );
  
      console.log("Booking submitted:", response);  // Log the response from Appwrite
      return response;
    } catch (error) {
      console.error("Failed to submit booking:", error);
      throw error;  // Rethrow the error so it can be caught in the submitBooking function
    }
  };


export { createAdminClient, createSessionClient, createUser , handleBookingSubmit };
