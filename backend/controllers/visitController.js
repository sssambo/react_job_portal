import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { VisitHistory } from "../models/visitSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const trackJobView = catchAsyncErrors(async (req, res, next) => {
	const {
		sessionId,
		jobId,
		externalJobUrl,
		jobTitle,
		companyName,
		referrer,
	} = req.body;

	if (!sessionId || !jobTitle) {
		return next(
			new ErrorHandler("Please provide session ID and job title !"),
		);
	}

	const visitRecord = await VisitHistory.create({
		sessionId,
		jobId: jobId || null,
		externalJobUrl: externalJobUrl || null,
		jobTitle,
		companyName: companyName || null,
		referrer: referrer || null,
		userAgent: req.headers["user-agent"] || null,
	});

	res.status(201).json({
		success: true,
		message: "Visit tracked successfully !",
		data: visitRecord,
	});
});

export const getVisitHistory = catchAsyncErrors(async (req, res, next) => {
	const { sessionId } = req.params;

	if (!sessionId) {
		return next(new ErrorHandler("Please provide session ID !"));
	}

	const history = await VisitHistory.find({ sessionId })
		.populate("jobId")
		.sort({ visitedAt: -1 });

	res.status(200).json({
		success: true,
		data: history,
	});
});

export const deleteVisitRecord = catchAsyncErrors(async (req, res, next) => {
	const { id } = req.params;

	const record = await VisitHistory.findById(id);
	if (!record) {
		return next(new ErrorHandler("Visit record not found !"));
	}

	await record.deleteOne();

	res.status(200).json({
		success: true,
		message: "Visit record deleted successfully !",
	});
});
