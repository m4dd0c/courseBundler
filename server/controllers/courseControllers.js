import { Course } from "../Model/Course.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

//showig all course
export const getAllCourses = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  const allCourses = await Course.find({
    $or: [
      {
        category: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
    ],
  });
  if (!allCourses)
    return next(new ErrorHandler("Your course list is empty", 400));

  res.status(200).json({
    success: true,
    allCourses,
  });
});

//create one course

export const createCourse = catchAsyncError(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  // const alreadyExist = await Course.find({title})
  // if(alreadyExist) return next(new ErrorHandler("Course alread exist", 400))

  const file = req.file;
  if (!file) {
    return next(new ErrorHandler("thumbnail not provided", 401));
  }
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  return res.status(201).json({
    success: "true",
    message: "Created",
  });
});

//delete one course

export const deleteCourse = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) return next(new ErrorHandler("course not found", 404));

  await cloudinary.v2.uploader.destroy(course.poster.public_id);

  for (let i = 0; i < course.lectures.length; i++) {
    const singleLecture = course.lectures[i];
    await cloudinary.v2.uploader.destroy(singleLecture.video.public_id, {
      resource_type: "video",
    });
  }

  await course.deleteOne();

  return res.status(201).json({
    success: "true",
    message: "course deleted successfully",
  });
});

//when you click on one course you'll see all available lectures in that course - the code of that controller is as below
// in simple words = show all lectures of a course
// we'll pass id of the course in the url to see the lectures of perticular course.
export const getCourseLectures = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new ErrorHandler("id not found", 404));

  const currentCourse = await Course.findById(id);
  if (!currentCourse) return next(new ErrorHandler("course not found ", 404));

  currentCourse.views += 1;
  await currentCourse.save();

  return res.status(200).json({
    success: true,
    lectures: currentCourse.lectures,
  });
});

//create one lecture in a course using req.params
export const addLecture = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!title || !description)
    return next(new ErrorHandler("Title or description not found", 404));

  const theCourse = await Course.findById(id);
  if (!theCourse) return next(new ErrorHandler("Course not found", 404));

  const lectureExists = theCourse.lectures.some(
    (lecture) => lecture.title === title,
  );
  if (lectureExists)
    return next(new ErrorHandler("Lecture already exists", 400));

  const file = req.file;
  if (!file) return next(new ErrorHandler("Video file not provided", 400));

  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
  });
  theCourse.lectures.push({
    title,
    description,
    video: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  theCourse.numOfVideos = theCourse.lectures.length;
  await theCourse.save();
  return res.status(200).json({
    success: true,
    message: "Lecture added successfully to the course",
  });
});

//delete a lecture from a coures without /:id here we'll use req.query
export const deleteLecture = catchAsyncError(async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  const course = await Course.findById(courseId);
  if (!course) return next(new ErrorHandler("course not found"));

  const lecture = course.lectures.find((item) => {
    if (item._id.toString() === lectureId.toString()) return item;
  });

  await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
    resource_type: "video",
  });

  course.lectures = course.lectures.filter((item) => {
    if (item._id.toString() !== lectureId.toString()) return item;
  });

  course.numOfVideos = course.lectures.length;
  await course.save();

  return res.status(200).json({
    success: true,
    message: "lecture deleted successfully",
  });
});
