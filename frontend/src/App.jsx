import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layouts from "./Layouts";

// Lazy-loaded pages
const Home = lazy(() => import("./page/Home"));
const AddBlog = lazy(() => import("./page/AddBlog"));
const UserPage = lazy(() => import("./page/UserPage"));
const UpdateBlog = lazy(() => import("./page/UpdateBlog"));
const UserAccount = lazy(() => import("./page/UserAccount"));
const SaveBlog = lazy(() => import("./page/SaveBlog"));

// Non-lazy pages (small)
import Login from "./page/Login";
import CreateAccount from "./page/CreateAccount";
import { useDispatch } from "react-redux";
import { fetchMe } from "./features/authThunk";

export default function App() {
  const disptch = useDispatch()
  useEffect(()=>{
    disptch(fetchMe())
  }, [disptch])
  return (
    <Routes>
      {/* Routes with layout */}
      <Route element={<Layouts />}>
        {/* Suspense wraps only the lazy-loaded component */}
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

      {/* Routes without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/createaccount" element={<CreateAccount />} />
    </Routes>
  );
}
