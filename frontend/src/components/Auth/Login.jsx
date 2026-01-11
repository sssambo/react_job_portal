import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { userLogin } from "../../utils/api";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const location = useLocation();
	const navigateTo = useNavigate();

	const { isAuthorized, setIsAuthorized } = useContext(Context);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const { data } = await userLogin(email, password, role);
			toast.success(data.message);
			setEmail("");
			setPassword("");
			setRole("");
			setIsAuthorized(true);
			const from = location.state?.from || "/";
			navigateTo(from);
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	if (isAuthorized) {
		return <Navigate to={"/"} />;
	}

	return (
		<>
			<section className="authPage">
				<div className="container">
					<div className="header">
						<img src="/careerconnect-black.png" alt="logo" />
						<h3>Login to your account</h3>
					</div>
					<form>
						<div className="inputTag">
							<label>Login As</label>
							<div>
								<select
									value={role}
									onChange={(e) => setRole(e.target.value)}
								>
									<option value="">Select Role</option>

									<option value="Job Seeker">
										Job Seeker
									</option>
									<option value="Employer">Employer</option>
								</select>
								<FaRegUser />
							</div>
						</div>
						<div className="inputTag">
							<label>Email Address</label>
							<div>
								<input
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<MdOutlineMailOutline />
							</div>
						</div>
						<div className="inputTag">
							<label>Password</label>
							<div>
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your Password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
								<span
									onClick={() =>
										setShowPassword(!showPassword)
									}
									style={{ cursor: "pointer" }}
								>
									{showPassword ? (
										<AiOutlineEyeInvisible />
									) : (
										<AiOutlineEye />
									)}
								</span>
								<RiLock2Fill />
							</div>
						</div>
						<button type="submit" onClick={handleLogin}>
							Login
						</button>
						<Link to={"/forgot-password"}>Forgot Password?</Link>
						<Link to={"/register"}>Register Now</Link>
					</form>
				</div>
				<div className="banner">
					<img src="/login.png" alt="login" />
				</div>
			</section>
		</>
	);
};

export default Login;
