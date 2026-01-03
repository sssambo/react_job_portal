import React, { useState, useEffect } from "react";
import { RiLock2Fill } from "react-icons/ri";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const email = searchParams.get("email");
	const otp = searchParams.get("otp");

	useEffect(() => {
		if (!email || !otp) {
			toast.error("Invalid request. Please start from forgot password.");
			navigate("/forgot-password");
		}
	}, [email, otp, navigate]);

	const handleResetPassword = async (e) => {
		e.preventDefault();
		if (!newPassword || !confirmPassword) {
			toast.error("Please fill all fields");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		try {
			setLoading(true);
			const { data } = await axios.post(
				"http://localhost:4000/api/v1/user/reset-password",
				{ email, otp, newPassword, confirmPassword },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			toast.success(data.message);
			setNewPassword("");
			setConfirmPassword("");
			// Navigate to login page
			navigate("/login");
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to reset password"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<section className="authPage">
				<div className="container">
					<div className="header">
						<img src="/careerconnect-black.png" alt="logo" />
						<h3>Reset Password</h3>
					</div>
					<form>
						<div className="inputTag">
							<label>New Password</label>
							<div>
								<input
									type={showNewPassword ? "text" : "password"}
									placeholder="Enter new password"
									value={newPassword}
									onChange={(e) =>
										setNewPassword(e.target.value)
									}
									required
								/>
								<RiLock2Fill />
							</div>
						</div>
						<div className="inputTag">
							<label>Confirm Password</label>
							<div>
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									placeholder="Confirm password"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									required
								/>
								<RiLock2Fill />
							</div>
						</div>
						<p
							style={{
								fontSize: "0.85rem",
								color: "#999",
								margin: "10px 0",
							}}
						>
							Password must be at least 8 characters long
						</p>
						<button
							type="submit"
							onClick={handleResetPassword}
							disabled={loading}
						>
							{loading ? "Resetting..." : "Reset Password"}
						</button>
						<Link to={"/login"}>Back to Login</Link>
					</form>
				</div>
				<div className="banner">
					<img src="/login.png" alt="reset-password" />
				</div>
			</section>
		</>
	);
};

export default ResetPassword;
