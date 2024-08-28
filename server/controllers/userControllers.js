import { User } from "../Model/User.js";
import sendToken from "../utils/sendToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import { mailSender } from "../utils/mailSender.js";
import crypto from "crypto";
import { Course } from "../Model/Course.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";

export const registerController = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new ErrorHandler("Fill all fields", 500));

  const isExist = await User.findOne({ email });
  if (isExist) return next(new ErrorHandler("User already exist", 500));

  const file = req.file;
  if (!file) {
    return next(new ErrorHandler("Avatar is mandatory", 401));
  }
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  const newUser = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  return sendToken(newUser, "User created successfully", 201, res);
});

export const loginController = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const doesExist = await User.findOne({ email }).select("+password");

  if (!doesExist) return next(new ErrorHandler("First reg then login", 500));

  const isLegit = await doesExist.comparePassword(password);

  if (!isLegit) return next(new ErrorHandler("wrong password", 500));

  return sendToken(doesExist, "Login Successfully", 200, res);
});

export const logoutController = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
});

// export const getProfileController = catchAsyncError(async(req, res, next)=>{

//   const fetchingId = req.id
//   console.log(req.id)
//   // if(!fetchingId) return next(new ErrorHandler("Unauthorized user first login", 401))
//     const profile = await User.findById(fetchingId)
//     if(!profile) return next(new ErrorHandler("Profile fatching failed", 401))

//     console.log(profile)
//     res.status(201).json({
//       success : true,
//       message: "Get profile run successfully",
//       profile
//     })

// })

export const getProfileController = catchAsyncError(async (req, res, next) => {
  const userId = req.id;
  if (!userId) return next(new ErrorHandler("Unauthorized user", 401));

  const User1 = await User.findById(userId);
  if (!User1) return next(new ErrorHandler("User not found", 401));

  return res.status(201).json({
    success: true,
    message: "User get successfully",
    User1,
  });
});

export const changePasswordController = catchAsyncError(
  async (req, res, next) => {
    const userId = req.id;
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || !oldPassword)
      return next(new ErrorHandler("Fill both fields", 500));
    if (!userId) return next(new ErrorHandler("Unauthorized user", 401));

    const User1 = await User.findById(userId).select("+password");
    if (!User1) return next(new ErrorHandler("User not found", 401));

    // console.log("---------here========")
    // console.log("oldPassword",oldPassword, "newPassword", newPassword)
    const isMatch = await User1.comparePassword(oldPassword);
    // console.log("---------here1========")
    // console.log(isMatch)
    if (!isMatch) return next(new ErrorHandler("oldPassword doesn't match"));

    User1.password = newPassword;
    User1.save();

    return res.status(201).json({
      success: true,
      message: "Password changed successfully",
      User1,
    });
  },
);

export const updateProfileController = catchAsyncError(
  async (req, res, next) => {
    const userId = req.id;
    const { name, email } = req.body;

    if (!name || !email) return next(new ErrorHandler("Fill both fields", 500));
    if (!userId) return next(new ErrorHandler("Unauthorized user", 401));

    const User1 = await User.findById(userId);
    if (!User1) return next(new ErrorHandler("User not found", 401));

    const file = req.file;
    if (file) {
      await cloudinary.v2.uploader.destroy(User1.avatar.public_id);
      const fileUri = getDataUri(file);
      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
      User1.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    if (name) User1.name = name;
    if (email) User1.email = email;
    User1.save();

    return res.status(201).json({
      success: true,
      message: "Profile Updated Successfully",
      User1,
    });
  },
);

export const updateProfilePictureController = catchAsyncError(
  async (req, res, next) => {
    const userId = req.id;
    if (!userId) return next(new ErrorHandler("Unauthorized user", 401));

    const User1 = await User.findById(userId);
    if (!User1) return next(new ErrorHandler("User not found", 401));

    await cloudinary.v2.uploader.destroy(User1.avatar.public_id);

    const file = req.file;
    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    User1.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await User1.save();

    return res.status(201).json({
      success: true,
      message: "Profile Picture Updated Successfully",
    });
  },
);

export const forgetPasswordController = catchAsyncError(
  async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new ErrorHandler("Firts enter email field", 401));

    const doesExist = await User.findOne({ email });
    if (!doesExist)
      return next(
        new ErrorHandler(
          "User with this mail doesn't exist in the database",
          401,
        ),
      );

    const subject = "Forget password - CourseBundler";

    const resetToken = crypto.randomBytes(10).toString("hex");
    const url = process.env.FRONTEND_URL + "/resetpassword/" + resetToken;
    const body = url;
    const mailSendSuccessfully = await mailSender(email, subject, body);

    if (!mailSendSuccessfully)
      return next(new ErrorHandler("Mail sending failed", 500));

    doesExist.ResetPasswordToken = resetToken;
    doesExist.ResetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    doesExist.save();
    return res.status(201).json({
      success: true,
      message: `Mail sent successfully on ${email}`,
    });
  },
);

export const resetPasswordController = catchAsyncError(
  async (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword)
      return next(new ErrorHandler("Both passwords are not matching", 401));

    if (!newPassword || !confirmPassword)
      return next(new ErrorHandler("Fill all field", 401));
    // 8:
    const { token } = req.params;
    const changableUser = await User.findOne({
      ResetPasswordToken: token,
      ResetPasswordExpire: { $gt: Date.now() },
    }).select("+password");
    if (!changableUser)
      return next(new ErrorHandler("Token expired or not found", 401));

    await User.findByIdAndUpdate(changableUser._id, {
      ResetPasswordToken: null,
      ResetPasswordExpire: null,
    });
    changableUser.password = newPassword;
    changableUser.save();
    return res.status(200).json({
      success: true,
      message: "Password has updated",
    });
  },
);

export const addToPlaylistController = catchAsyncError(
  async (req, res, next) => {
    const userId = req.id;
    const { courseId } = req.body;

    if (!userId || !courseId)
      return next(new ErrorHandler("Unauthorized access denied", 401));

    const theUser = await User.findById(userId);

    if (!theUser) return next(new ErrorHandler("User not available", 500));

    const theCourse = await Course.findById(courseId);

    if (!theCourse) return next(new ErrorHandler("User not available", 500));

    const itemExist = theUser.playlist.find((item) => {
      if (item.course.toString() === theCourse._id.toString()) return true;
    });

    if (itemExist)
      return next(
        new ErrorHandler("Course already present in your playlist", 409),
      );

    theUser.playlist.push({
      courseName: theCourse.title,
      course: theCourse._id,
      poster: theCourse.poster.url,
    });

    theUser.save();

    return res.status(200).json({
      success: true,
      message: "Added to playlist",
    });
  },
);

export const removeFromPlaylistController = catchAsyncError(
  async (req, res, next) => {
    const userId = req.id;
    const { courseId } = req.query;
    if (!userId || !courseId)
      return next(new ErrorHandler("Unauthorized access denied", 401));

    const theUser = await User.findById(userId);
    if (!theUser) return next(new ErrorHandler("User not available", 500));

    const theCourse = await Course.findById(courseId); // yeh print nhi ho hia
    if (!theCourse) return next(new ErrorHandler("course not available", 500));

    const newPlaylist = theUser.playlist.filter((item) => {
      if (item.course.toString() !== theCourse._id.toString()) return item;
    });
    //we're altering theUser.profile so we've to save it using save() method
    theUser.playlist = newPlaylist;
    theUser.save();
    return res.status(200).json({
      success: true,
      message: "Remvoed from playlist",
    });
  },
);

//admin controllers

export const getAllUsersController = catchAsyncError(async (req, res, next) => {
  const allUsers = await User.find();
  res.status(200).json({
    success: true,
    allUsers,
  });
});

export const updateRoleController = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.role === "admin") user.role = "user";
  else user.role = "admin";

  await user.save();

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
  });
});

export const deleteAnyUserController = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    //cancel subscription

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  },
);

export const deleteProfileController = catchAsyncError(
  async (req, res, next) => {
    const id = req.id;
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    //cancel subscription
    await user.deleteOne();
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Your profile get deleted successfully",
      });
  },
);
