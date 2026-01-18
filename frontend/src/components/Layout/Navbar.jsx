import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { userLogout } from "../../utils/api";

const Navbar = () => {
	const [show, setShow] = useState(false);
	const { isAuthorized, setIsAuthorized, user } = useContext(Context);
	const navigateTo = useNavigate();

	const handleLogout = async () => {
		try {
			const response = await userLogout();
			toast.success(response.data.message);
			setIsAuthorized(false);
			navigateTo("/login");
		} catch (error) {
			(toast.error(error.response.data.message), setIsAuthorized(true));
		}
	};

	return (
		<nav className="navbar">
			<div className="container">
				<div className="logo">
					<img src="/careerconnect-white.png" alt="logo" />
				</div>
				<div className={!show ? "menu" : "show-menu menu"}>
					<li>
						<Link to={"/"} onClick={() => setShow(false)}>
							HOME
						</Link>
					</li>
					<li>
						<Link to={"/job/getall"} onClick={() => setShow(false)}>
							ALL JOBS
						</Link>
					</li>

					{isAuthorized ? (
						<>
							<li>
								<Link
									to={"/applications/me"}
									onClick={() => setShow(false)}
								>
									{user && user.role === "Employer"
										? "APPLICANT'S APPLICATIONS"
										: "MY APPLICATIONS"}
								</Link>
							</li>
							{user && user.role === "Employer" ? (
								<>
									<li>
										<Link
											to={"/job/post"}
											onClick={() => setShow(false)}
										>
											POST NEW JOB
										</Link>
									</li>
									<li>
										<Link
											to={"/job/me"}
											onClick={() => setShow(false)}
										>
											VIEW YOUR JOBS
										</Link>
									</li>
								</>
							) : null}
							<li>
								<Link
									to={"/profile"}
									onClick={() => setShow(false)}
								>
									PROFILE
								</Link>
							</li>
							<button onClick={handleLogout}>LOGOUT</button>
						</>
					) : (
						<>
							<li>
								<Link
									to={"/login"}
									onClick={() => setShow(false)}
								>
									LOGIN
								</Link>
							</li>
							<li>
								<Link
									to={"/register"}
									onClick={() => setShow(false)}
								>
									REGISTER
								</Link>
							</li>
						</>
					)}
				</div>
				<div className="hamburger" onClick={() => setShow(!show)}>
					{show ? <AiOutlineClose /> : <GiHamburgerMenu />}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
