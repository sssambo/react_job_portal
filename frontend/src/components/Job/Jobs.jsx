import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { trackJobView } from "../../utils/sessionManager";

const Jobs = () => {
	const [jobs, setJobs] = useState([]);
	const { isAuthorized } = useContext(Context);
	const navigateTo = useNavigate();

	useEffect(() => {
		try {
			axios
				.get("http://localhost:4000/api/v1/job/getall", {
					withCredentials: true,
				})
				.then((res) => {
					setJobs(res.data);
				});
		} catch (error) {
			console.log(error);
		}
	}, []);

	const handleJobClick = (job) => {
		// Track the job view
		trackJobView({
			jobId: job._id,
			title: job.title,
			company: "Unknown",
			url: null,
		});
	};

	return (
		<section className="jobs page">
			<div className="container">
				<h1>ALL AVAILABLE JOBS</h1>
				<div className="banner">
					{jobs.jobs &&
						jobs.jobs.map((element) => {
							return (
								<div className="card" key={element._id}>
									<p>{element.title}</p>
									<p>{element.category}</p>
									<p>{element.country}</p>
									<Link
										to={`/job/${element._id}`}
										onClick={() => handleJobClick(element)}
									>
										Job Details
									</Link>
								</div>
							);
						})}
				</div>
			</div>
		</section>
	);
};

export default Jobs;
