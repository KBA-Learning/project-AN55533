import React from 'react';
import { Link } from 'react-router-dom';
 import getUserType from '../utils/auth'

const Navbar = () => {

  const userType = getUserType();
 

  return (
    <div className="bg-blue-400 p-4 shadow-lg">
      {userType === "admin" ? (
        <nav className="flex items-center justify-between">
          {/* <div className="text-2xl font-bold text-orange-500">TRAVEL</div> */}
          <h1 className="text-2xl font-bold ">Welcome to Travel System</h1>
          <Link
            className="text-xl text-gray font-semibold hover:text-black-400 transition  ml-[700px]"
            to="/AddPackages"
          >
            Add Package
          </Link>
          <Link
            className="text-xl text-gray font-semibold hover:text-black-400 transition ml-[50px]"
            to="/viewpackage"
          >
            View Package
          </Link>

          <Link
            className="text-xl text-gray font-semibold hover:text-black-400 transition"
            to="/adminhome"
          >
            Home
          </Link>
          <Link
            className="text-xl text-gray font-semibold hover:text-black-400 transition"
            to="/logout"
          >
            {/* Logout */}
          </Link>
        </nav>
      ) : (
        <nav className="space-x-6  ml-[850px]">
          <h3 className="text-4xl font-bold ml-[-800px] text-red-400 ">
            Welcome to Travel system
          </h3>
          <Link
            className="text-black-600 hover:bg-blue-200 font-bold text-[20px]"
            to="/userhome"
          >
            HOME
          </Link>
          <Link
            className="text-black-600 hover:bg-blue-200 font-bold text-[20px]"
            to="/viewpackage"
          >
            PACKAGES
          </Link>
          <Link
            className="text-black-600 hover:bg-blue-200 font-bold text-[20px]"
            to="/booking"
          >
            BOOKING
          </Link>
          <Link
            className="text-black-600 hover:bg-blue-200 font-bold text-[20px]"
            to="/logout"
          >
            LOGOUT
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
