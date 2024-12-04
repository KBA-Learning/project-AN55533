import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Hero from "./components/Hero.jsx";
import Login from "./pages/Login.jsx";
import Sign from "./pages/Sign.jsx";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import UserHome from "./pages/UserHome.jsx";
import AddPackages from "./pages/AddPackages.jsx";
import ViewPackage from "./pages/ViewPackage.jsx";
import BookPackage from "./pages/Booking.jsx";
import UpdatePackage from "./pages/UpdatePackage.jsx";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />

        {/* Protected Routes */}
        <Route element={<AuthLayout />}>
          <Route element={<MainLayout />}>
            {/* Common Routes */}
            <Route path="/home" element={<Home />} />

            {/* Admin Routes */}
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/AddPackages" element={<AddPackages />} />
            <Route path="/viewpackage" element={<ViewPackage />} />
            <Route path="/updatepackage/:id" element={<UpdatePackage />} />

            {/* User Routes */}
            <Route path="/userhome" element={<UserHome />} />
            <Route path="/booking/:id" element={<BookPackage />} />
            <Route path="/booking" element={<BookPackage />} />
          </Route>
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
