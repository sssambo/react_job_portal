import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { postJob } from "../../utils/api";

const PostJob = () => {
	const { isAuthorized, user } = useContext(Context);
	const navigate = useNavigate();

	const [form, setForm] = useState({
		title: "",
		description: "",
		category: "",
		jobType: "",
		workMode: "Onsite",
		country: "",
		city: "",
		address: "",
		salaryType: "Negotiable",
		salaryFixed: "",
		salaryFrom: "",
		salaryTo: "",
		currency: "NGN",
		roles: [""], // array of responsibilities
		benefits: [""], // array of perks
	});

	if (!isAuthorized || user?.role !== "Employer") navigate("/");

	const handleChange = (e, idx, arrayField) => {
		const { name, value } = e.target;
		if (arrayField) {
			const updated = [...form[arrayField]];
			updated[idx] = value;
			setForm({ ...form, [arrayField]: updated });
		} else {
			setForm({ ...form, [name]: value });
		}
	};

	const addArrayField = (field) =>
		setForm({ ...form, [field]: [...form[field], ""] });
	const removeArrayField = (field, idx) => {
		const updated = form[field].filter((_, i) => i !== idx);
		setForm({ ...form, [field]: updated });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const payload = {
			title: form.title,
			description: form.description,
			category: form.category,
			jobType: form.jobType,
			workMode: form.workMode,
			location: {
				country: form.country,
				city: form.city,
				address: form.address,
				isRemote: form.workMode === "Remote",
			},
			salary: {
				type: form.salaryType,
				fixed:
					form.salaryType === "Fixed"
						? Number(form.salaryFixed)
						: undefined,
				from:
					form.salaryType === "Range"
						? Number(form.salaryFrom)
						: undefined,
				to:
					form.salaryType === "Range"
						? Number(form.salaryTo)
						: undefined,
				currency: form.currency,
			},
			roles: form.roles.filter(Boolean),
			benefits: form.benefits.filter(Boolean),
		};

		try {
			const res = await postJob(payload);
			toast.success(res.data.message);
		} catch (err) {
			toast.error(err.response?.data?.message || "Job post failed");
		}
	};

	return (
		<div className="job_post page">
			<div className="container">
				<h3>POST NEW JOB</h3>
				<form onSubmit={handleSubmit}>
					<input
						name="title"
						placeholder="Job Title"
						value={form.title}
						onChange={handleChange}
					/>
					<textarea
						name="description"
						placeholder="Job Summary"
						value={form.description}
						onChange={handleChange}
					/>
					<select
						name="category"
						value={form.category}
						onChange={handleChange}
					>
						<option value="">Select Category</option>
						<option value="Frontend Development">
							Frontend Development
						</option>
						<option value="Backend Development">
							Backend Development
						</option>
						<option value="Design">Design</option>
						<option value="Marketing">Marketing</option>
					</select>
					<select
						name="jobType"
						value={form.jobType}
						onChange={handleChange}
					>
						<option value="">Job Type</option>
						<option value="Full-Time">Full-Time</option>
						<option value="Part-Time">Part-Time</option>
						<option value="Contract">Contract</option>
						<option value="Internship">Internship</option>
						<option value="Volunteer">Volunteer</option>
					</select>
					<select
						name="workMode"
						value={form.workMode}
						onChange={handleChange}
					>
						<option value="Onsite">Onsite</option>
						<option value="Remote">Remote</option>
						<option value="Hybrid">Hybrid</option>
					</select>

					{form.workMode !== "Remote" && (
						<>
							<input
								name="country"
								placeholder="Country"
								value={form.country}
								onChange={handleChange}
							/>
							<input
								name="city"
								placeholder="City"
								value={form.city}
								onChange={handleChange}
							/>
							<input
								name="address"
								placeholder="Address"
								value={form.address}
								onChange={handleChange}
							/>
						</>
					)}

					<select
						name="salaryType"
						value={form.salaryType}
						onChange={handleChange}
					>
						<option value="Negotiable">Negotiable</option>
						<option value="Flexible">Flexible</option>
						<option value="Fixed">Fixed</option>
						<option value="Range">Range</option>
						<option value="Unpaid">Unpaid / Volunteer</option>
					</select>

					{form.salaryType === "Fixed" && (
						<input
							name="salaryFixed"
							type="number"
							placeholder="Fixed Salary"
							value={form.salaryFixed}
							onChange={handleChange}
						/>
					)}
					{form.salaryType === "Range" && (
						<>
							<input
								name="salaryFrom"
								type="number"
								placeholder="Salary From"
								value={form.salaryFrom}
								onChange={handleChange}
							/>
							<input
								name="salaryTo"
								type="number"
								placeholder="Salary To"
								value={form.salaryTo}
								onChange={handleChange}
							/>
						</>
					)}

					<div>
						<h4>Roles / Responsibilities</h4>
						{form.roles.map((r, idx) => (
							<div key={idx}>
								<input
									value={r}
									onChange={(e) =>
										handleChange(e, idx, "roles")
									}
								/>
								<button
									type="button"
									onClick={() =>
										removeArrayField("roles", idx)
									}
								>
									Remove
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => addArrayField("roles")}
						>
							Add Role
						</button>
					</div>

					<div>
						<h4>Benefits / Perks</h4>
						{form.benefits.map((b, idx) => (
							<div key={idx}>
								<input
									value={b}
									onChange={(e) =>
										handleChange(e, idx, "benefits")
									}
								/>
								<button
									type="button"
									onClick={() =>
										removeArrayField("benefits", idx)
									}
								>
									Remove
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => addArrayField("benefits")}
						>
							Add Benefit
						</button>
					</div>

					<button type="submit">Create Job</button>
				</form>
			</div>
		</div>
	);
};

export default PostJob;
