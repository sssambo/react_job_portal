import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, required: true },

		category: { type: String, required: true },
		jobType: {
			type: String,
			enum: [
				"Full-Time",
				"Part-Time",
				"Contract",
				"Internship",
				"Volunteer",
			],
			required: true,
		},
		workMode: {
			type: String,
			enum: ["Onsite", "Remote", "Hybrid"],
			default: "Onsite",
		},

		location: {
			country: String,
			city: String,
			address: String,
			isRemote: { type: Boolean, default: false },
		},

		salary: {
			type: {
				type: String,
				enum: ["Fixed", "Range", "Negotiable", "Flexible", "Unpaid"],
				default: "Negotiable",
			},
			fixed: Number,
			from: Number,
			to: Number,
			currency: { type: String, default: "NGN" },
			period: {
				type: String,
				enum: ["Monthly", "Yearly", "Hourly"],
				default: "Monthly",
			},
		},

		requirements: {
			education: [String], // BSc, HND, ND, MSc, PhD
			certifications: [String], // NYSC, PMP, AWS
			experienceYears: { min: Number, max: Number },
			skills: [String],
		},

		roles: { type: [String], required: true }, // structured responsibilities
		benefits: { type: [String], default: [] }, // optional perks

		eligibility: {
			countriesAllowed: [String],
			visaSponsored: Boolean,
			nyscRequired: Boolean,
		},

		source: {
			type: String,
			enum: ["Employer", "Admin", "AI", "Scraped"],
			default: "Employer",
		},

		postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		originalSourceUrl: String,
		expired: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

/**
 * Salary validation
 */
jobSchema.pre("save", function (next) {
	if (this.salary.type === "Fixed" && !this.salary.fixed)
		return next(new Error("Fixed salary requires a value."));
	if (this.salary.type === "Range" && (!this.salary.from || !this.salary.to))
		return next(new Error("Salary range requires from and to values."));
	if (this.salary.from && this.salary.to && this.salary.from > this.salary.to)
		return next(new Error("Salary from cannot exceed salary to."));
	next();
});

export const Job = mongoose.model("Job", jobSchema);
