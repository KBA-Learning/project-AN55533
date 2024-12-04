import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Booking = () => {
   const [buyername, setBuyername] = useState("");
   const [persons, setPersons] = useState("");
   const [date, setDate] = useState("");
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("Authtoken"))
        ?.split("=")[1];

      const response = await fetch(`/api/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          buyername,
          persons,
          date,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate("/userhome"); // Redirect to user home or bookings page
      } else {
        alert(result.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Error while booking package:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-400">
      <h1 className="text-2xl font-bold mb-4">Book Your Package</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="buyername"
            className="border border-gray-300 rounded-lg w-full p-2"
            value={buyername}
            onChange={(e) => setBuyername(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="persons"
            className="border border-gray-300 rounded-lg w-full p-2"
            value={persons}
            onChange={(e) => setPersons(e.target.value)}
            required
          />

          <input
            type="date"
            placeholder="date"
            className="border border-gray-300 rounded-lg w-full p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* <div>
            <p className="text-lg font-medium">Total Price: ${totalPrice}</p>
          </div> */}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
