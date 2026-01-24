import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
function Footer() {
	const { isAuthorized } = useContext(Context);
	return (
		<footer className="footerShow">
			<div>&copy; All Rights Reserved by sssamb0.</div>
			<div>
				<Link to={"https://github.com/sssambo"} target="github">
					<FaGithub></FaGithub>
				</Link>
				<Link to={"https://leetcode.com/u/sssambo/"} target="leetcode">
					<SiLeetcode></SiLeetcode>
				</Link>
				<Link
					to={"https://www.linkedin.com/in/sssambo/"}
					target="linkedin"
				>
					<FaLinkedin></FaLinkedin>
				</Link>
				<Link
					to={"https://www.instagram.com/sssambo/"}
					target="instagram"
				>
					<RiInstagramFill></RiInstagramFill>
				</Link>
			</div>
		</footer>
	);
}

export default Footer;
