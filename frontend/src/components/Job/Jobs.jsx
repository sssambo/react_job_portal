import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { trackJobView } from "../../utils/sessionManager";
import { getAllJobs } from "../../utils/api";

const Jobs = () => {
	const [jobs, setJobs] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const { isAuthorized } = useContext(Context);
	const navigateTo = useNavigate();

	useEffect(() => {
		try {
			getAllJobs().then((res) => {
				setJobs(res.data.jobs || []);
			});
		} catch (error) {
			console.log(error);
		}
	}, []);

	const handleJobClick = (job) => {
		trackJobView({
			jobId: job._id,
			title: job.title,
			company: "Unknown",
			url: null,
		});
	};

	const filteredJobs = jobs.filter((job) => {
		const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
		const matchesCity = selectedCity ? job.location?.city === selectedCity : true;
		return matchesSearch && matchesCategory && matchesCity;
	});

	const categories = [...new Set(jobs.map((job) => job.category))];
	const cities = [...new Set(jobs.map((job) => job.location?.city).filter(Boolean))];

	return (
		<section className="jobs page">
			<div className="container">
				<h1>ALL AVAILABLE JOBS</h1>
				<div className="search-filters">
					<input
						type="text"
						placeholder="Search jobs by title..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
						<option value="">All Categories</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>{cat}</option>
						))}
					</select>
					<select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
						<option value="">All Cities</option>
						{cities.map((city) => (
							<option key={city} value={city}>{city}</option>
						))}
					</select>
				</div>
				<div className="banner">
					{filteredJobs.length > 0 ? (
						filteredJobs.map((element) => (
							<div className="card" key={element._id}>
								<p>{element.title}</p>
								<p>{element.category}</p>
								<p>{element.location?.country}</p>
								<Link
									to={`/job/${element._id}`}
									onClick={() => handleJobClick(element)}
								>
									Job Details
								</Link>
							</div>
						))
					) : (
						<p>No jobs found.</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default Jobs;
