import axios from "axios";

export const getOrCreateSessionId = () => {
	let sessionId = localStorage.getItem("guestSessionId");

	if (!sessionId) {
		sessionId = `guest_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;
		localStorage.setItem("guestSessionId", sessionId);
	}

	return sessionId;
};

export const trackJobView = async (jobData) => {
	const sessionId = getOrCreateSessionId();

	try {
		await axios.post(
			"http://localhost:4000/api/v1/visits/track-view",
			{
				sessionId,
				jobId: jobData.jobId || null,
				externalJobUrl: jobData.url || null,
				jobTitle: jobData.title,
				companyName: jobData.company || null,
				referrer: jobData.referrer || window.location.href,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (error) {
		console.error("Failed to track job view:", error);
	}
};

export const getVisitHistory = async () => {
	const sessionId = getOrCreateSessionId();

	try {
		const response = await axios.get(
			`http://localhost:4000/api/v1/visits/history/${sessionId}`
		);
		return response.data.data || [];
	} catch (error) {
		console.error("Failed to fetch visit history:", error);
		return [];
	}
};

export const deleteVisitRecord = async (recordId) => {
	try {
		await axios.delete(
			`http://localhost:4000/api/v1/visits/history/${recordId}`
		);
	} catch (error) {
		console.error("Failed to delete visit record:", error);
	}
};

export const clearAllHistory = async () => {
	const sessionId = getOrCreateSessionId();
	const history = await getVisitHistory();

	for (const record of history) {
		await deleteVisitRecord(record._id);
	}
};
