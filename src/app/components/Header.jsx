import React from 'react'
import auth from '@/auth'
import { LogOut} from "lucide-react";
import { Playfair_Display } from "next/font/google";


const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic"], // Add this line to include italic style
});
  
const Header = async () => {
    const user = await auth.getUser()
  return (
    <header className='bg-[#ece3d4]'>
        <>{user && (<p className = {`${playfairDisplay.className} text-black font-semibold text-xl`}> Hi,  {user?.name ? user?.name.charAt(0).toUpperCase() + user?.name.substr(1).toLowerCase(): ''  || user.email} <br />
        <span className="text-sm text-gray-500">User ID: {user?.$id}</span> {/* Displaying user ID */}</p>)}</>
        <div>
            <form action={auth.deleteSession}>
                <button className = {`${playfairDisplay.className} flex`}>
                    <LogOut/>Logout
                </button>
            </form>
        </div>
    </header>
  )
}
export default Header;