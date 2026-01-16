import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../../main";
import { getJobById } from "../../utils/api";

const JobDetails = () => {
	const { id } = useParams();
	const [job, setJob] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthorized, user } = useContext(Context);

	useEffect(() => {
		getJobById(id)
			.then((res) => setJob(res.data.job))
			.catch(() => navigate("/notfound"));
	}, [id, navigate]);

	const handleApplyClick = () => {
		if (!isAuthorized) {
			navigate("/login", { state: { from: location.pathname } });
		} else {
			navigate(`/application/${job._id}`);
		}
	};

	if (!job) return null;

	const renderSalary = () => {
		if (!job.salary) return "Not provided";
		switch (job.salary.type) {
			case "Fixed":
				return `${job.salary.currency} ${job.salary.fixed} / ${job.salary.period}`;
			case "Range":
				return `${job.salary.currency} ${job.salary.from} - ${job.salary.to} / ${job.salary.period}`;
			case "Negotiable":
			case "Flexible":
				return job.salary.type;
			case "Unpaid":
				return "Unpaid / Volunteer";
			default:
				return "Not provided";
		}
	};

	return (
		<section className="jobDetail page">
			<div className="container">
				<h3>Job Details</h3>
				<div className="banner">
					<p>
						<strong>Title:</strong> {job.title}
					</p>
					<p>
						<strong>Category:</strong> {job.category}
					</p>
					<p>
						<strong>Job Type:</strong> {job.jobType}
					</p>
					<p>
						<strong>Work Mode:</strong> {job.workMode}
					</p>
					<p>
						<strong>Location:</strong>{" "}
						{job.location?.isRemote
							? "Remote"
							: `${job.location?.address || ""}, ${
									job.location?.city || ""
							  }, ${job.location?.country || ""}`}
					</p>
					<p>
						<strong>Description:</strong> {job.description}
					</p>
					{job.roles?.length > 0 && (
						<>
							<p>
								<strong>Responsibilities:</strong>
							</p>
							<ul>
								{job.roles?.map((role, idx) => (
									<li key={idx}>{role}</li>
								))}
							</ul>
						</>
					)}
					{job.benefits?.length > 0 && (
						<>
							<p>
								<strong>Benefits / Perks:</strong>
							</p>
							<ul>
								{job.benefits.map((benefit, idx) => (
									<li key={idx}>{benefit}</li>
								))}
							</ul>
						</>
					)}
					<p>
						<strong>Salary:</strong> {renderSalary()}
					</p>
					<p>
						<strong>Posted On:</strong>{" "}
						{new Date(job.createdAt).toLocaleDateString()}
					</p>

					{(!user || user.role !== "Employer") && (
						<button onClick={handleApplyClick}>
							{isAuthorized ? "Apply Now" : "Login to Apply"}
						</button>
					)}
				</div>
			</div>
		</section>
	);
};

export default JobDetails;
