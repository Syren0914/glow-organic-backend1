"use client";

import { useState, useEffect } from "react"; 
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, Calendar as CalendarIcon } from "lucide-react";
import { handleBookingSubmit, createSessionClient } from "@/appwrite/config"; // Import your booking submit function
import { Playfair_Display } from "next/font/google";
import { useRouter } from "next/navigation"; // Correct import for App Router








const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic"], // Add this line to include italic style
});


// Enhanced mock data for services with descriptions
// const services = [
//   { 
//     id: 1, 
//     name: "Classic Haircut", 
//     description: "A precision cut tailored to your face shape and hair type. Includes wash, cut, and style.",
//     price: 30,
//     duration: "45 min"
//   },
//   { 
//     id: 2, 
//     name: "Hair Coloring", 
//     description: "Full color service using premium dyes. Includes consultation, application, and style.",
//     price: 60,
//     duration: "2 hours"
//   },
//   { 
//     id: 3, 
//     name: "Luxury Manicure", 
//     description: "Pamper your hands with our deluxe manicure. Includes soak, exfoliation, massage, and polish.",
//     price: 25,
//     duration: "45 min"
//   },
//   { 
//     id: 4, 
//     name: "Spa Pedicure", 
//     description: "Rejuvenate your feet with our spa pedicure. Includes foot bath, callus removal, and massage.",
//     price: 35,
//     duration: "1 hour"
//   },
//   { 
//     id: 5, 
//     name: "Revitalizing Facial", 
//     description: "Refresh and renew your skin with our signature facial. Customized for your skin type.",
//     price: 45,
//     duration: "1 hour"
//   },
// ]

const availableTimes = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00",
];

export default function SalonBooking() {
  const router = useRouter(); 
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null); // State for logged-in user ID
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPhone, setUserPhone] = useState(null);


  // Fetch user ID (replace this with your actual authentication logic)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/orders", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          // Destructure user data from response
          const { user, orders, services } = data;  // Assuming your response contains user info
          console.log(user);  // Log user details to check

          // Set user details in state
          setUserId(user.$id);  // Set the user ID
          setUserEmail(user.email);  // Set the user email
          setUserName(user.name);    // Set the user name
          setUserPhone(user.phone)
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserDetails();
  }, []); 
  //Fetching services from Appwrite
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        setUserId(data.user.$id);  // Set user ID from the fetched data
        setServices(data.services);  // Set services from the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = services.find(s => s.$id === id);
    return sum + (service?.price || 0);
  }, 0);
  
  const totalDuration = selectedServices.reduce((sum, id) => {
    const service = services.find(s => s.$id === id);
    return sum + (parseInt(service?.duration.split(' ')[0]) || 0);
  }, 0);
  

  const submitBooking = async (event) => {
    event.preventDefault();
  
    // Convert selected services into a string and ensure it doesn't exceed 10,000 characters
    const selectedServicesString = selectedServices.join(", ");  // Convert array to string
  
    // Check if the length exceeds 10,000 characters
    if (selectedServicesString.length > 10000) {
      alert("The selected services exceed the 10,000 character limit.");
      return;
    }
  
    if (!userId) {
      alert("Please log in before booking.");
      return;
    }
  
    setIsSubmitting(true);
    try {
      // Pass the selectedServicesString as a string to handleBookingSubmit
      await handleBookingSubmit({
        selectedServices: selectedServicesString, // Pass the string
        selectedDate,
        selectedTime,
        userId,
        userName,
        userEmail,
        userPhone
      });
      console.log({ selectedServices, selectedDate, selectedTime, userId, userName, userEmail,userPhone });
      alert("Booking successful!");
      router.push("/thankyou");
    } catch (error) {
      console.error("Booking submission failed:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className>
        <CardHeader>
          <CardTitle className = {`${playfairDisplay.className} text-3xl font-medium`}>Book Your Salon Experience</CardTitle>
          <CardDescription>Choose from our range of luxurious services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <h3 className = {`${playfairDisplay.className} text-2xl font-semibold mb-4`}>Our Services</h3>
              <ScrollArea className="h-[500px] rounded-md border p-4">
                {services.map((service) => (
                  <Card key={service.$id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`${playfairDisplay.className} text-lg`}>{service.name}</CardTitle>
                        <div className="text-sm font-medium">${service.price}</div>
                      </div>
                      <CardDescription>{service.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service.$id}`}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.$id)}
                        />
                        <label
                          htmlFor={`service-${service.$id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Select this service
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </div>
            <div className="md:col-span-5">
              <h3 className={`${playfairDisplay.className} text-2xl font-semibold mb-4`}>Select Date</h3>
              <div className="p-4 border rounded-md ">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="mx-auto "
                />
              </div>
              {selectedDate && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Available Times</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={`w-full ${selectedTime === time ? "text-white" : "text-black"}`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="flex flex-col space-y-2 text-left w-full">
            <h3 className={`${playfairDisplay.className} text-2xl font-semibold`}>Booking Summary</h3>
            <p className="flex items-center"><Scissors className="mr-2 h-4 w-4" /> Services: {selectedServices.length} selected</p>
            {selectedDate && <p className="flex items-center"><CalendarIcon className="mr-2 h-4 w-4" /> Date: {selectedDate.toDateString()}</p>}
            {selectedTime && <p className="flex items-center"><Clock className="mr-2 h-4 w-4" /> Time: {selectedTime}</p>}
            <p className="flex items-center"><Clock className="mr-2 h-4 w-4" /> Total Duration: {totalDuration} minutes</p>
            <p className={`${playfairDisplay.className} text-2xl font-medium mt-2`}>Total: ${totalPrice}</p>
          </div>
          <Button className={`${playfairDisplay.className} mt-4 w-full text-lg py-6`} onClick={submitBooking}>Book Your Experience</Button>
        </CardFooter>
      </Card>
      <h2>Welcome, {userName || "Guest"}!</h2> {/* Display user name or "Guest" if not available */}
      <p>Email: {userEmail || "Not logged in"}</p> {/* Display user email or "Not logged in" */}
      <p>Phone: {userPhone || "Not logged in"}</p> {/* Display user email or "Not logged in" */}

    </div>
  );
}
