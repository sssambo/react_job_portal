import React, {
	useContext,
	useEffect,
	useState,
	useCallback,
	useRef,
} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { trackJobView } from "../../utils/sessionManager";
import { getAllJobs } from "../../utils/api";
import AdSenseComponent from "../Common/AdSenseComponent";

const Jobs = () => {
	const [jobs, setJobs] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const { isAuthorized } = useContext(Context);
	const navigateTo = useNavigate();
	const observer = useRef();

	const lastJobElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prevPage) => prevPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore],
	);

	useEffect(() => {
		const fetchJobs = async () => {
			setLoading(true);
			try {
				const res = await getAllJobs(page, 9);
				setJobs((prevJobs) => {
					const newJobs = res.data.jobs || [];
					const combined = [...prevJobs, ...newJobs];
					return Array.from(
						new Map(
							combined.map((item) => [item._id, item]),
						).values(),
					);
				});
				setHasMore(res.data.hasMore);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchJobs();
	}, [page]);

	const handleJobClick = (job) => {
		trackJobView({
			jobId: job._id,
			title: job.title,
			company: "Unknown",
			url: null,
		});
	};

	const filteredJobs = jobs.filter((job) => {
		const matchesSearch = job.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory = selectedCategory
			? job.category === selectedCategory
			: true;
		const matchesCity = selectedCity
			? job.location?.city === selectedCity
			: true;
		return matchesSearch && matchesCategory && matchesCity;
	});

	const categories = [...new Set(jobs.map((job) => job.category))];
	const cities = [
		...new Set(jobs.map((job) => job.location?.city).filter(Boolean)),
	];

	return (
		<section className="jobs page">
			<div className="sidebar-ads">
				<AdSenseComponent slot="sidebar-slot-1" />
				ads
				<AdSenseComponent slot="sidebar-slot-2" />
			</div>
			<div className="container">
				<div className="search-filters">
					<input
						type="text"
						placeholder="Search jobs by title..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
					>
						<option value="">All Categories</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
					<select
						value={selectedCity}
						onChange={(e) => setSelectedCity(e.target.value)}
					>
						<option value="">All Cities</option>
						{cities.map((city) => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</select>
				</div>
				<h1>ALL AVAILABLE JOBS</h1>
				<div className="banner">
					{filteredJobs.length > 0
						? filteredJobs.map((element, index) => {
								const elements = [];

								const card = (
									<div
										className="card"
										key={element._id}
										ref={
											filteredJobs.length === index + 1
												? lastJobElementRef
												: null
										}
									>
										<p>{element.title}</p>
										<p>{element.category}</p>
										<p>{element.location?.country}</p>
										<Link
											to={`/job/${element._id}`}
											onClick={() =>
												handleJobClick(element)
											}
										>
											Job Details
										</Link>
									</div>
								);

								elements.push(card);

								if ((index + 1) % 3 === 0) {
									elements.push(
										<div
											key={`ad-${index}`}
											className="ad-slot"
										>
											<AdSenseComponent
												slot="in-feed-slot"
												format="fluid"
											/>
										</div>,
									);
								}

								return elements;
							})
						: !loading && <p>No jobs found.</p>}

					{loading && (
						<div className="loading">
							<p>Loading more jobs...</p>
						</div>
					)}
				</div>
			</div>
			<div className="homecategories">categories tab</div>
		</section>
	);
};

export default Jobs;
