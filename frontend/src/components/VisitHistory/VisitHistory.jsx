import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	getVisitHistory,
	deleteVisitRecord,
	clearAllHistory,
	getOrCreateSessionId,
} from "../../utils/sessionManager";
import toast from "react-hot-toast";

const VisitHistory = () => {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const sessionId = getOrCreateSessionId();

	useEffect(() => {
		fetchHistory();
	}, []);

	const fetchHistory = async () => {
		setLoading(true);
		const historyData = await getVisitHistory();
		setHistory(historyData);
		setLoading(false);
	};

	const handleDeleteRecord = async (recordId) => {
		await deleteVisitRecord(recordId);
		toast.success("Visit record deleted!");
		fetchHistory();
	};

	const handleClearAll = async () => {
		if (window.confirm("Are you sure you want to clear all history?")) {
			await clearAllHistory();
			toast.success("All history cleared!");
			fetchHistory();
		}
	};

	return (
		<section className="page">
			<div className="container">
				<h1>Your Browsing History</h1>
				<p style={{ marginBottom: "20px", color: "#666" }}>
					Session ID: <strong>{sessionId}</strong>
				</p>

				{loading ? (
					<p>Loading history...</p>
				) : history.length === 0 ? (
					<div style={{ textAlign: "center", padding: "40px 20px" }}>
						<p>No jobs viewed yet.</p>
						<Link to="/job/getall">Browse Jobs</Link>
					</div>
				) : (
					<>
						<button
							onClick={handleClearAll}
							style={{
								marginBottom: "20px",
								padding: "8px 15px",
								backgroundColor: "#f44336",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							Clear All History
						</button>

						<div
							style={{
								display: "grid",
								gridTemplateColumns:
									"repeat(auto-fill, minmax(300px, 1fr))",
								gap: "20px",
							}}
						>
							{history.map((record) => (
								<div
									key={record._id}
									style={{
										border: "1px solid #ddd",
										borderRadius: "8px",
										padding: "15px",
										backgroundColor: "#f9f9f9",
									}}
								>
									<h3>{record.jobTitle}</h3>
									{record.companyName && (
										<p>Company: {record.companyName}</p>
									)}
									<p
										style={{
											fontSize: "0.85rem",
											color: "#999",
										}}
									>
										Visited:{" "}
										{new Date(
											record.visitedAt
										).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>

									{record.jobId && (
										<Link
											to={`/job/${record.jobId._id}`}
											style={{
												display: "inline-block",
												marginRight: "10px",
												marginTop: "10px",
												padding: "6px 12px",
												backgroundColor: "#007bff",
												color: "white",
												textDecoration: "none",
												borderRadius: "4px",
												fontSize: "0.9rem",
											}}
										>
											View Job
										</Link>
									)}

									{record.externalJobUrl && (
										<a
											href={record.externalJobUrl}
											target="_blank"
											rel="noopener noreferrer"
											style={{
												display: "inline-block",
												marginRight: "10px",
												marginTop: "10px",
												padding: "6px 12px",
												backgroundColor: "#28a745",
												color: "white",
												textDecoration: "none",
												borderRadius: "4px",
												fontSize: "0.9rem",
											}}
										>
											External Link
										</a>
									)}

									<button
										onClick={() =>
											handleDeleteRecord(record._id)
										}
										style={{
											marginTop: "10px",
											padding: "6px 12px",
											backgroundColor: "#dc3545",
											color: "white",
											border: "none",
											borderRadius: "4px",
											cursor: "pointer",
											fontSize: "0.9rem",
										}}
									>
										Delete
									</button>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default VisitHistory;
