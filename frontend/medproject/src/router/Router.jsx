import { lazy } from "react";
import Layout from "../layouts/layout/Layout";
import { createBrowserRouter } from "react-router";
import Loader from "../layouts/components/loader/Loader";

const Home = lazy(() => import("../pages/home/Home"));
const About = lazy(() => import("../pages/about/About"));
const Contact = lazy(() => import("../pages/contact/Contact"));
const Tips = lazy(() => import("../pages/tips/Tips"));
const Category = lazy(() => import("../pages/category/Category"));
const ErrorPage = lazy(() => import("../pages/errorPage/ErrorPage"));
const Login = lazy(() => import("../pages/login/Login"));
const PatientRegister = lazy(() => import("../pages/register/PatientRegister"));
const DoctorRegister = lazy(() => import("../pages/register/DoctorRegister"));
const Admin = lazy(() => import("../pages/admin/Admin"));
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const Profile = lazy(() => import("../pages/profile/Profile"));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/tips', element: <Tips /> },
      { path: '/category', element: <Category /> },
    ]
  },
  { path: '*', element: <ErrorPage /> },
  { path: '/login', element: <Login /> },
  { path: '/PatientRegister', element: <PatientRegister /> },
  { path: '/DoctorRegister', element: <DoctorRegister /> },
  { path: '/dashboard', element: <Admin /> },
  { path: '/admin-login', element: <AdminLogin /> },
  { path: '/profile', element: <Profile /> },

]);