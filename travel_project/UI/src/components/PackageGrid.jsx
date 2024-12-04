import React, { useState, useEffect } from "react";
import PackageCard from "./PackageCard";

const PackageGrid = ({ isHome }) => {
  const [packages, setPackages] = useState([]);

  const packageList = isHome ? packages.slice(0, 3) : packages;

  // Fetch packages from the backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/viewpackage");
        if (!res.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await res.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  // Handle delete package from the list
  const handleDeletePackage = (packageId) => {
    setPackages((prevPackages) =>
      prevPackages.filter((pkg) => pkg._id !== packageId)
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mx-5 my-10">
      {packageList.map((pkg) => (
        <PackageCard
          key={pkg._id}
          packages={pkg}
          onDelete={handleDeletePackage} // Pass down delete handler
        />
      ))}
    </div>
  );
};

export default PackageGrid;
