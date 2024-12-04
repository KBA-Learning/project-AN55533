import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import a1 from "../assets/a1.jpeg";

const AddPackages = () => {
  const [packageName, setPackageName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [packageDestination, setPackageDestination] = useState("");
  const [packageDays, setPackageDays] = useState("");
  const [packageNights, setPackageNights] = useState("");
  const [packageAccommodation, setPackageAccommodation] = useState("");
  const [packageTransportation, setPackageTransportation] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();




  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected!");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file!");
      return;
    }
    setSelectedImage(file);
  };  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      alert("Please upload a package image!");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("packageName", packageName);
    formData.append("packageDescription", packageDescription);
    formData.append("packageDestination", packageDestination);
    formData.append("packageDays", packageDays);
    formData.append("packageNights", packageNights);
    formData.append("packageAccommodation", packageAccommodation);
    formData.append("packageTransportation", packageTransportation);
    formData.append("packagePrice", packagePrice);
    formData.append("packageImage", selectedImage); // Attach the image file

    try {
      const response = await fetch("/api/AddPackages", {
        method: "POST",
        body: formData, // Send as multipart/form-data
      });

      if (response.status === 403) {
        alert("You have no permission");
        navigate("/home");
      } else if (response.ok) {
        alert("Package Added Successfully");
        navigate("/viewpackage");
      } else {
        const error = await response.json();
        alert(`Failed to Add Package: ${error.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-400 p-6">
      <div className="hidden md:flex w-1/2 items-center justify-center  ">
        <img
          src={a1}
          alt="Travel"
          className="rounded-lg shadow-lg h-[700px] mt-[-80px]"
        />
      </div>

      {/* Right Side Form Section */}
      <div className="w-full md:w-1/2 bg-blue shadow-lg rounded-lg p-8">
        <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6">
          Add Package
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Package Name"
            className="border border-gray-300 rounded-lg w-full p-2"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            required
          />

          <textarea
            placeholder="Package Description"
            className="border border-gray-300 rounded-lg w-full p-2 resize-none"
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Destination"
            className="border border-gray-300 rounded-lg w-full p-2"
            value={packageDestination}
            onChange={(e) => setPackageDestination(e.target.value)}
            required
          />

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Days"
              className="border border-gray-300 rounded-lg w-full p-2"
              value={packageDays}
              onChange={(e) => setPackageDays(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Nights"
              className="border border-gray-300 rounded-lg w-full p-2"
              value={packageNights}
              onChange={(e) => setPackageNights(e.target.value)}
              required
            />
          </div>

          <textarea
            placeholder="Accommodation Details"
            className="border border-gray-300 rounded-lg w-full p-2 resize-none"
            value={packageAccommodation}
            onChange={(e) => setPackageAccommodation(e.target.value)}
            required
          />

          <select
            className="border border-gray-300 rounded-lg w-full p-2"
            value={packageTransportation}
            onChange={(e) => setPackageTransportation(e.target.value)}
            required
          >
            <option value="">Select Transportation</option>
            <option>Flight</option>
            <option>Train</option>
            <option>Boat</option>
            <option>Other</option>
          </select>

          <input
            type="number"
            placeholder="Price"
            className="border border-gray-300 rounded-lg w-full p-2"
            value={packagePrice}
            onChange={(e) => setPackagePrice(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            name="packageImage"
            className="border border-gray-300 rounded-lg w-full py-2 px-3"
            onChange={handleImageChange}
            required
          />
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="w-32 h-32 rounded-lg object-cover mt-4"
            />
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPackages;
