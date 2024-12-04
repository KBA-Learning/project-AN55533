import React from "react";
import { Link } from "react-router-dom";
import a3 from "../assets/a3.jpeg";

const UserHome = () => {
  return (
    <div className="min-h-screen bg-cover bg-gray-400 flex flex-col justify-between">
      {/* Header */}
      {/* <nav className="flex justify-between items-center bg-opacity-70 bg-black px-8 md:px-24 py-4">
        <div className="text-2xl font-bold text-orange-500">TRAVEL User</div>
        <div>
          <Link
            to="/logout"
            className="text-gray-200 hover:text-white bg-red-500 hover:bg-red-600 font-bold py-2 px-6 rounded"
          >
            Logout
          </Link>
        </div>
      </nav> */}

      {/* Dashboard */}
      <div className=" w-full">
        <img
          src={a3}
          alt="Travel"
          className=" shadow-lg h-[700px] mt-[-1px] w-[2000px]"
        />
      </div>
    </div>
  );
};

export default UserHome;
