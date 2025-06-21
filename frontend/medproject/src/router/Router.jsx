import Layout from "../layouts/layout/Layout";
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import Tips from "../pages/tips/Tips";
import Category from "../pages/category/Category";
import { createBrowserRouter } from "react-router";
import ErrorPage from "../pages/errorPage/ErrorPage";
import Login from "../pages/login/Login";
import PatienRegister from "../pages/register/PatienRegister";
import DoctorRegister from "../pages/register/DoctorRegister";



export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/about',
                element: <About />
            },
            {
                path: '/contact',
                element: <Contact />
            },
            {
                path: '/tips',
                element: <Tips />
            },
            {
                path: '/categories',
                element: <Category />
            },
        ]
    },
    {
        path: '*',
        element: <ErrorPage />
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/PatientRegister',
        element: <PatienRegister/>
    },
    {
        path: '/DoctorRegister',
        element: <DoctorRegister/>
    },
])