import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to store package details
  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: "",
    packageNights: "",
    packageAccommodation: "",
    packageTransportation: "",
    packagePrice: ""
  });

  // State to manage loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the current package data
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/updatepackage/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch package data");
        }
        const data = await res.json();
        setPackageData(data); // Populate state with fetched data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/updatepackage/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      if (res.ok) {
        const updatedData = await res.json();
        alert("Package updated successfully!");
        navigate(`/packages/${id}`); // Redirect after successful update
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update package");
      }
    } catch (err) {
      setError("An error occurred while updating the package.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageData({
      ...packageData,
      [name]: value,
    });
  };

  // Render
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <section className="bg-white mb-20">
      <div className="container m-auto max-w-2xl py-2">
        <div className="bg-purple-100 px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl text-purple-800 text-center font-semibold mb-6">
            Update Package
          </h1>
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Package Name
              </label>
              <input
                type="text"
                name="packageName"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Package Name"
                value={packageData.packageName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Repeat similar inputs for other fields */}
            {/* Package Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Package Description
              </label>
              <textarea
                name="packageDescription"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Package Description"
                value={packageData.packageDescription}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Other fields */}
            {/* Destination, Days, Nights, etc. */}

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Package Price
              </label>
              <input
                type="number"
                name="packagePrice"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Package Price"
                value={packageData.packagePrice}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              Update Package
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdatePackage;
