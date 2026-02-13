import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layouts from "./Layouts";
import { useDispatch } from "react-redux";
import { fetchMe } from "./features/authThunk";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy-loaded pages
const Home = lazy(() => import("./page/Home"));
const AddBlog = lazy(() => import("./page/AddBlog"));
const UserPage = lazy(() => import("./page/UserPage"));
const UpdateBlog = lazy(() => import("./page/UpdateBlog"));
const UserAccount = lazy(() => import("./page/UserAccount"));
const SaveBlog = lazy(() => import("./page/SaveBlog"));

// Non-lazy pages
import Login from "./page/Login";
import CreateAccount from "./page/CreateAccount";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Routes with Layout */}
        <Route element={<Layouts />}>
          <Route
            index
            element={
              <Suspense fallback={<div className="text-center mt-20">Loading Home...</div>}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/addblog"
            element={
              <Suspense fallback={<div className="text-center mt-20">Loading AddBlog...</div>}>
                <AddBlog />
              </Suspense>
            }
          />
          <Route
            path="/userpage/:id"
            element={
              <Suspense fallback={<div className="text-center mt-20">Loading UserPage...</div>}>
                <UserPage />
              </Suspense>
            }
          />
          <Route
            path="/userUpdate/:id"
            element={
              <Suspense fallback={<div className="text-center mt-20">Loading UpdateBlog...</div>}>
                <UpdateBlog />
              </Suspense>
            }
          />
          <Route
            path="/user/:id/blogs"
            element={
              <Suspense fallback={<div className="text-center mt-20">Loading UserAccount...</div>}>
                <UserAccount />
              </Suspense>
            }
          />
          <Route
            path="/saveBlog"
            element={
              <Suspense fallback={<div className="text-center mt-20">Loading SaveBlog...</div>}>
                <SaveBlog />
              </Suspense>
            }
          />
        </Route>

        {/* Routes without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />} />
      </Routes>

      {/* ✅ Toast Container MUST be outside Routes */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}
