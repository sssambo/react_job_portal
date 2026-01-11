import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// User endpoints
export const userLogin = (email, password, role) =>
	api.post("/user/login", { email, password, role });

export const userRegister = (name, phone, email, role, password) =>
	api.post("/user/register", { name, phone, email, role, password });

export const getUser = () =>
	api.get("/user/getuser");

export const userLogout = () =>
	api.get("/user/logout");

export const forgotPassword = (email) =>
	api.post("/user/forgot-password", { email });

export const verifyOTP = (email, otp) =>
	api.post("/user/verify-otp", { email, otp });

export const resetPassword = (email, otp, newPassword, confirmPassword) =>
	api.post("/user/reset-password", { email, otp, newPassword, confirmPassword });

// Job endpoints
export const getAllJobs = () =>
	api.get("/job/getall");

export const getJobById = (id) =>
	api.get(`/job/${id}`);

export const getMyJobs = () =>
	api.get("/job/getmyjobs");

export const postJob = (jobData) =>
	api.post("/job/post", jobData);

export const updateJob = (id, jobData) =>
	api.put(`/job/update/${id}`, jobData);

export const deleteJob = (id) =>
	api.delete(`/job/delete/${id}`);

// Application endpoints
export const getEmployerApplications = () =>
	api.get("/application/employer/getall");

export const getJobSeekerApplications = () =>
	api.get("/application/jobseeker/getall");

export const postApplication = (formData) =>
	api.post("/application/post", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const deleteApplication = (id) =>
	api.delete(`/application/delete/${id}`);

// Visit tracking endpoints
export const trackJobView = (trackingData) =>
	api.post("/visits/track-view", trackingData);

export const getVisitHistory = (sessionId) =>
	api.get(`/visits/history/${sessionId}`);

export const deleteVisitRecord = (recordId) =>
	api.delete(`/visits/history/${recordId}`);

export default api;
