import mongoose from "mongoose";

const visitHistorySchema = new mongoose.Schema({
	sessionId: {
		type: String,
		required: [true, "Please provide session ID"],
		index: true,
	},
	jobId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Job",
		default: null,
	},
	externalJobUrl: {
		type: String,
		default: null,
	},
	jobTitle: {
		type: String,
		required: [true, "Please provide job title"],
	},
	companyName: {
		type: String,
		default: null,
	},
	visitedAt: {
		type: Date,
		default: Date.now,
	},
	referrer: {
		type: String,
		default: null,
	},
	userAgent: {
		type: String,
		default: null,
	},
});

export const VisitHistory = mongoose.model("VisitHistory", visitHistorySchema);
