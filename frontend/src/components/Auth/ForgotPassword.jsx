import React, { useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../utils/api";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleForgotPassword = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await forgotPassword(email);
			toast.success(data.message);
			setEmail("");
			navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to send OTP");
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
						<h3>Forgot Password</h3>
					</div>
					<form>
						<div className="inputTag">
							<label>Email Address</label>
							<div>
								<input
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<MdOutlineMailOutline />
							</div>
						</div>
						<button
							type="submit"
							onClick={handleForgotPassword}
							disabled={loading}
						>
							{loading ? "Sending OTP..." : "Send OTP"}
						</button>
						<Link to={"/login"}>Back to Login</Link>
					</form>
				</div>
				<div className="banner">
					<img src="/login.png" alt="forgot-password" />
				</div>
			</section>
		</>
	);
};

export default ForgotPassword;
