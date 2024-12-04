import React from 'react';
import { Link } from 'react-router-dom';
import a1 from "../assets/a1.jpeg";
const AdminHome = () => {
  return (
    <div>
      {/* Header
      <nav className="flex justify-between items-center bg-opacity-70 bg-black px-8 md:px-24 py-4">
        <div className="text-2xl font-bold text-orange-500">TRAVEL Admin</div>
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
      <div
        className="flex flex-col  h-full px-8 py-16  "
        
      >
        <   img 
          src={a1}
          alt="Travel"
          className=" shadow-lg h-[700px] mt-[-65px] w=[1680px]" 
        />
        {/* <div className="text-center bg-black bg-opacity-70 text-white rounded-lg shadow-lg p-10 max-w-lg w-full">
          <h1 className="text-4xl font-bold mb-6">Welcome to Travel System</h1> */}
          
          {/* <div className="space-y-4">
            <Link
              to="/AddPackages"
              className="block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Add Package
            </Link>
            <Link
              to="/viewpackage"
              className="block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              View Packages
            </Link>
            <Link
              to="/logout"
              className="block bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Logout
            </Link>
          </div> */}
        </div>
      </div>
    // </div>
  );
}

export default AdminHome;
