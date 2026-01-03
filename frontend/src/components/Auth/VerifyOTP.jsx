import React, { useState, useEffect } from "react";
import { RiLock2Fill } from "react-icons/ri";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyOTP = () => {
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const email = searchParams.get("email");

	useEffect(() => {
		if (!email) {
			toast.error("Email not found. Please start from forgot password.");
			navigate("/forgot-password");
		}
	}, [email, navigate]);

	const handleVerifyOTP = async (e) => {
		e.preventDefault();
		if (!otp) {
			toast.error("Please enter the OTP");
			return;
		}
		try {
			setLoading(true);
			const { data } = await axios.post(
				"http://localhost:4000/api/v1/user/verify-otp",
				{ email, otp },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			toast.success(data.message);
			setOtp("");
			// Navigate to reset password page
			navigate(
				`/reset-password?email=${encodeURIComponent(
					email
				)}&otp=${encodeURIComponent(otp)}`
			);
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to verify OTP"
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
						<h3>Verify OTP</h3>
					</div>
					<form>
						<div className="inputTag">
							<label>Enter OTP</label>
							<div>
								<input
									type="text"
									placeholder="Enter 6-digit OTP"
									value={otp}
									onChange={(e) =>
										setOtp(e.target.value.slice(0, 6))
									}
									maxLength="6"
									required
								/>
								<RiLock2Fill />
							</div>
						</div>
						<p
							style={{
								fontSize: "0.9rem",
								color: "#666",
								margin: "10px 0",
							}}
						>
							OTP sent to: <strong>{email}</strong>
						</p>
						<button
							type="submit"
							onClick={handleVerifyOTP}
							disabled={loading}
						>
							{loading ? "Verifying..." : "Verify OTP"}
						</button>
						<Link to={"/forgot-password"}>Resend OTP</Link>
					</form>
				</div>
				<div className="banner">
					<img src="/login.png" alt="verify-otp" />
				</div>
			</section>
		</>
	);
};

export default VerifyOTP;
