import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import VerifyOTP from "./components/Auth/VerifyOTP";
import ResetPassword from "./components/Auth/ResetPassword";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import VisitHistory from "./components/VisitHistory/VisitHistory";
import Profile from "./components/Profile/Profile";
import { getUser } from "./utils/api";

const App = () => {
	const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await getUser();
				setUser(response.data.user);
				setIsAuthorized(true);
			} catch (error) {
				setIsAuthorized(false);
			}
		};
		fetchUser();
	}, [isAuthorized]);

	return (
		<>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/forgot-password"
						element={<ForgotPassword />}
					/>
					<Route path="/verify-otp" element={<VerifyOTP />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="/" element={<Home />} />
					<Route path="/job/getall" element={<Jobs />} />
					<Route path="/job/:id" element={<JobDetails />} />
					<Route path="/application/:id" element={<Application />} />
					<Route
						path="/applications/me"
						element={<MyApplications />}
					/>
					<Route path="/job/post" element={<PostJob />} />
					<Route path="/job/me" element={<MyJobs />} />
					<Route path="/visit-history" element={<VisitHistory />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
				<Footer />
				<Toaster />
			</BrowserRouter>
		</>
	);
};

export default App;
