import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { Resend } from "resend";

export const register = catchAsyncErrors(async (req, res, next) => {
	const { name, email, phone, password, role } = req.body;
	if (!name || !email || !phone || !password || !role) {
		return next(new ErrorHandler("Please fill full form !"));
	}
	const isEmail = await User.findOne({ email });
	if (isEmail) {
		return next(new ErrorHandler("Email already registered !"));
	}
	const user = await User.create({
		name,
		email,
		phone,
		password,
		role,
	});
	sendToken(user, 201, res, "User Registered Sucessfully !");
});

export const login = catchAsyncErrors(async (req, res, next) => {
	const { email, password, role } = req.body;
	if (!email || !password || !role) {
		return next(
			new ErrorHandler("Please provide email ,password and role !")
		);
	}
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(new ErrorHandler("Invalid Email Or Password.", 400));
	}
	const isPasswordMatched = await user.comparePassword(password);
	if (!isPasswordMatched) {
		return next(new ErrorHandler("Invalid Email Or Password !", 400));
	}
	if (user.role !== role) {
		return next(
			new ErrorHandler(
				`User with provided email and ${role} not found !`,
				404
			)
		);
	}
	sendToken(user, 201, res, "User Logged In Sucessfully !");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
	res.status(201)
		.cookie("token", "", {
			httpOnly: true,
			expires: new Date(Date.now()),
		})
		.json({
			success: true,
			message: "Logged Out Successfully !",
		});
});

export const getUser = catchAsyncErrors((req, res, next) => {
	const user = req.user;
	res.status(200).json({
		success: true,
		user,
	});
});

//FORGOT PASSWORD - SEND OTP
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
	const { email } = req.body;
	if (!email) {
		return next(new ErrorHandler("Please provide an email address !"));
	}

	const user = await User.findOne({ email });
	if (!user) {
		return next(new ErrorHandler("User with this email not found !"));
	}

	//GENERATE OTP (6 digit)
	const otp = Math.floor(100000 + Math.random() * 900000).toString();

	// Set OTP and OTP expiry (10 minutes)
	user.otp = otp;
	user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
	await user.save();

	// Send OTP via email using Resend
	const resend = new Resend(process.env.RESEND_API_KEY);

	try {
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "Password Reset OTP",
			html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`,
		});

		res.status(200).json({
			success: true,
			message: "OTP sent to your email !",
		});
	} catch (error) {
		user.otp = null;
		user.otpExpiry = null;
		await user.save();
		return next(new ErrorHandler("Failed to send OTP email !"));
	}
});

//VERIFY OTP
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
	const { email, otp } = req.body;
	if (!email || !otp) {
		return next(new ErrorHandler("Please provide email and OTP !"));
	}

	const user = await User.findOne({ email });
	if (!user) {
		return next(new ErrorHandler("User with this email not found !"));
	}

	if (user.otp !== otp) {
		return next(new ErrorHandler("Invalid OTP !"));
	}

	if (new Date() > user.otpExpiry) {
		return next(new ErrorHandler("OTP has expired !"));
	}

	res.status(200).json({
		success: true,
		message: "OTP verified successfully !",
	});
});

//RESET PASSWORD
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
	const { email, otp, newPassword, confirmPassword } = req.body;

	if (!email || !otp || !newPassword || !confirmPassword) {
		return next(new ErrorHandler("Please provide all required fields !"));
	}

	if (newPassword !== confirmPassword) {
		return next(new ErrorHandler("Passwords do not match !"));
	}

	if (newPassword.length < 8 || newPassword.length > 32) {
		return next(
			new ErrorHandler("Password must be between 8 to 32 characters !")
		);
	}

	const user = await User.findOne({ email });
	if (!user) {
		return next(new ErrorHandler("User with this email not found !"));
	}

	if (user.otp !== otp) {
		return next(new ErrorHandler("Invalid OTP !"));
	}

	if (new Date() > user.otpExpiry) {
		return next(new ErrorHandler("OTP has expired !"));
	}

	user.password = newPassword;
	user.otp = null;
	user.otpExpiry = null;
	await user.save();

	res.status(200).json({
		success: true,
		message: "Password reset successfully !",
	});
});
