import { CalendarDays, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function Thankyou({ 
  date = "Friday, November 3", 
  time = "2:00 PM", 
  phoneNumber = "(555) 123-4567" 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
      <Card className="w-full max-w-md border-2 border-black">
        <CardHeader className="text-center border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-black">Thank You for Booking!</CardTitle>
          <CardDescription className="text-gray-600">We&apos;re excited to see you soon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-center space-x-2 text-lg font-medium text-black">
            <CalendarDays className="h-6 w-6" />
            <span>Your appointment is scheduled for:</span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-black">{date}</p>
            <p className="text-xl text-gray-700">at {time}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
            <h3 className="font-semibold text-black mb-2">Appointment Details:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Please arrive 5-10 minutes early</li>
              <li>Bring any reference photos you&apos;d like to show your stylist</li>
              <li>Feel free to call us if you need to reschedule</li>
            </ul>
            <div className="mt-3 flex items-center text-black">
              <Phone className="h-4 w-4 mr-2" />
              <span>{phoneNumber}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-black text-white hover:bg-gray-800">Add to Calendar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Thankyou;
