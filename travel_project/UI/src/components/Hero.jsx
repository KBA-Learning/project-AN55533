import React, { useState } from "react";
import h1 from "../assets/h1.jpeg";

import { Link } from "react-router-dom";
// import getUserType from "../utils/auth";

const Hero = () => {
   
  return (
    <>
      <div className="bg-blue-400 h-[860px]">
        <div>
          <nav className="flex justify-between items-center px-8 md:px-24 py-4">
            <div className="text-2xl font-bold text-orange-500 text-[40px]">
              TRAVEL
            </div>
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 font-bold"
              >
                Log in
              </Link>
              <Link
                to="/sign"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded"
              >
                Sign up
              </Link>
            </div>
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between mx-auto p-8 md:py-16 md:px-24">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-red-800">
                A travel planner for everyone
              </h1>
              <p className="text-lg text-gray-600 mb-6 ">
                Organize flights & hotels and map your trips in a travel app
                designed for vacation planning & road trips.
              </p>
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded"
                >
                  Start planning
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 mt-5 md:mt-0 relative">
              <img src={h1} alt="Travel" className="w-80 h-55px rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Hero;
