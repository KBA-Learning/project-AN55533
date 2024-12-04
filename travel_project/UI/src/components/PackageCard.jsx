import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PackageCard = ({
  packages,
  onDelete = () => {
    
  },
  onUpdate = () => {},
}) => {
  const [userType, setUserType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedPackage, setUpdatedPackage] = useState({ ...packages });

  useEffect(() => {
    const getUserType = () => {
      try {
        const authToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("Authtoken"))
          ?.split("=")[1];
        if (authToken) {
          const decoded = jwtDecode(authToken);
          return decoded.userType;
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
      return null;
    };

    setUserType(getUserType());
  }, []);

  const handleUpdate = async () => {
    try {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("Authtoken"))
        ?.split("=")[1];

      const response = await fetch(`/api/updatepackage/${packages._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedPackage),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData.package);
        setShowEditModal(false);
        alert("Package updated successfully");
      } else {
        const errorText = await response.text();
        alert(`Failed to update package: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating package:", error);
      alert("An error occurred while updating the package.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPackage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gray-300 rounded-md shadow-lg flex flex-col items-center justify-center p-6 mx-5 my-5">
      <img
        src={`/api/${packages.imageUrl}`} 
        
        alt={packages.packageName}
        className="rounded-lg shadow-md w-full h-48 object-cover mb-4"
      />

      <h2 className="font-bold text-lg text-blue-900 mb-2">
        {packages.packageName}
      </h2>

      <p className="text-sm text-gray-800">
        Description:{packages.packageDescription}
      </p>
      <p className="text-sm text-gray-800">
        Destination: {packages.packageDestination}
      </p>
      <p className="text-sm text-gray-800">
        Duration: {packages.packageDays} Days / {packages.packageNights} Nights
      </p>
      <p className="text-sm text-gray-800">
        Accommodation: {packages.packageAccommodation}
      </p>
      <p className="text-sm text-gray-800">
        Transportation: {packages.packageTransportation}
      </p>
      <p className="text-sm text-gray-800">Price: ₹{packages.packagePrice}</p>

      {userType === "admin" ? (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="text-xl text-gray-700 font-semibold hover:text-black transition"
          >
            Update
          </button>
          <button
            onClick={() => onDelete(packages._id)}
            className="text-xl text-red-600 font-semibold hover:text-red-800 transition"
          >
            Delete
          </button>
        </div>
      ) : (
        <Link
          className="text-xl text-gray-700 font-semibold hover:text-black transition"
          to={`/booking/${packages._id}`}
        >
          Book Now
        </Link>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content p-4 bg-white rounded-md shadow-lg">
            <h3 className="font-bold text-lg mb-4">Edit Package</h3>
            <form>
              <table className="min-w-full table-auto">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 text-gray-700">Package Name:</td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        name="packageName"
                        value={updatedPackage.packageName}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-4 text-gray-700">Description:</td>
                    <td className="py-2 px-4">
                      <textarea
                        name="packageDescription"
                        value={updatedPackage.packageDescription}
                        onChange={handleChange}
                        className="input-field"
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-700">Destination:</td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        name="packageDestination"
                        value={updatedPackage.packageDestination}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-700">Days:</td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        name="packageDays"
                        value={updatedPackage.packageDays}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-700">Nights:</td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        name="packageNights"
                        value={updatedPackage.packageNights}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-700">Accommodation:</td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        name="packageAccommodation"
                        value={updatedPackage.packageAccommodation}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-700">Transportation:</td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        name="packageTransportation"
                        value={updatedPackage.packageTransportation}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-700">Price:</td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        name="packagePrice"
                        value={updatedPackage.packagePrice}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="btn-primary"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageCard;
