import React from 'react'
import PackageGrid from '../components/PackageGrid'
const ViewPackage = () => {
  return (
    <>
      <div className="bg-gray-400 mt-[-40px]">
        <h1 className="text-center-2xl font-bold mt-10 text-[30px]">All Packages</h1>
        <PackageGrid isHome={false} />
      </div>
    </>
  );
}

export default ViewPackage;