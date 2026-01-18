import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Get all jobs (expired: false) with pagination
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 9;
	const skip = (page - 1) * limit;

	const jobs = await Job.find().skip(skip).limit(limit);
	const totalJobs = await Job.countDocuments();

	res.status(200).json({
		success: true,
		jobs,
		totalJobs,
		currentPage: page,
		totalPages: Math.ceil(totalJobs / limit),
		hasMore: skip + jobs.length < totalJobs,
	});
});

// Post a new job
export const postJob = catchAsyncErrors(async (req, res, next) => {
	const { role } = req.user;
	if (role === "Job Seeker") {
		return next(
			new ErrorHandler(
				"Job Seeker not allowed to access this resource.",
				400,
			),
		);
	}

	const {
		title,
		description,
		category,
		jobType,
		workMode,
		country,
		city,
		address,
		salary,
		roles,
		benefits,
	} = req.body;

	// Required basic fields
	if (!title || !description || !category || !jobType || !roles?.length) {
		return next(
			new ErrorHandler("Please provide all required job details.", 400),
		);
	}

	// Salary validation
	if (salary?.type === "Fixed" && !salary.fixed) {
		return next(new ErrorHandler("Fixed salary value is required.", 400));
	}
	if (
		salary?.type === "Range" &&
		(salary.from === undefined || salary.to === undefined)
	) {
		return next(
			new ErrorHandler("Salary range requires from and to values.", 400),
		);
	}

	const postedBy = req.user._id;

	const job = await Job.create({
		title,
		description,
		category,
		jobType,
		workMode,
		location: {
			country,
			city,
			address,
			isRemote: workMode === "Remote",
		},
		salary,
		roles,
		benefits: benefits || [],
		postedBy,
		source: "Employer",
	});

	res.status(201).json({
		success: true,
		message: "Job Posted Successfully!",
		job,
	});
});

// Get jobs posted by the current user
export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
	const { role } = req.user;
	if (role === "Job Seeker") {
		return next(
			new ErrorHandler(
				"Job Seeker not allowed to access this resource.",
				400,
			),
		);
	}
	const myJobs = await Job.find({ postedBy: req.user._id });
	res.status(200).json({ success: true, myJobs });
});

// Update a job
export const updateJob = catchAsyncErrors(async (req, res, next) => {
	const { role } = req.user;
	if (role === "Job Seeker") {
		return next(
			new ErrorHandler(
				"Job Seeker not allowed to access this resource.",
				400,
			),
		);
	}

	const { id } = req.params;
	let job = await Job.findById(id);
	if (!job) return next(new ErrorHandler("Job not found.", 404));

	// Optional: validate salary if provided in update
	const { salary } = req.body;
	if (salary) {
		if (salary.type === "Fixed" && !salary.fixed) {
			return next(
				new ErrorHandler("Fixed salary value is required.", 400),
			);
		}
		if (
			salary.type === "Range" &&
			(salary.from === undefined || salary.to === undefined)
		) {
			return next(
				new ErrorHandler(
					"Salary range requires from and to values.",
					400,
				),
			);
		}
	}

	job = await Job.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({ success: true, message: "Job Updated!", job });
});

// Delete a job
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
	const { role } = req.user;
	if (role === "Job Seeker") {
		return next(
			new ErrorHandler(
				"Job Seeker not allowed to access this resource.",
				400,
			),
		);
	}

	const { id } = req.params;
	const job = await Job.findById(id);
	if (!job) return next(new ErrorHandler("Job not found.", 404));

	await job.deleteOne();
	res.status(200).json({ success: true, message: "Job Deleted!" });
});

// Get a single job
export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
	const { id } = req.params;
	try {
		const job = await Job.findById(id);
		if (!job) return next(new ErrorHandler("Job not found.", 404));

		res.status(200).json({ success: true, job });
	} catch (error) {
		return next(new ErrorHandler("Invalid ID / CastError", 404));
	}
});
