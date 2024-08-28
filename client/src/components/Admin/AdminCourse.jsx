import { useEffect } from "react";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction } from "../../redux/actions/courseActions";
import { deleteOneCourseAction } from "../../redux/actions/adminAction";
import Loader from "../layout/Loader";

const AdminCourse = () => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courseReducer);

  useEffect(() => {
    dispatch(getAllCoursesAction());
  }, [dispatch]);

  const viewLectures = (id) => {
    console.log(id);
  };

  const deleteLecture = async (id) => {
    await dispatch(deleteOneCourseAction(id));
    dispatch(getAllCoursesAction());
  };
  const { loading } = useSelector((state) => state.globalReducer);
  return loading ? (
    <Loader />
  ) : (
    <>
      (
      <>
        {" "}
        <div className="bg-lightColor min-h-[610px]">
          <h1 className="text-center text-5xl text-white py-14 font-bold">
            All Available Courses
          </h1>
          <div className="mb-10">
            <SideBar />
          </div>
          <div className="grid place-content-center">
            <div>
              <div>
                <table className="">
                  <thead>
                    <tr className="text-cyanColor font-light pb-4">
                      <td className="p-2 text-center px-6">Title</td>
                      <td className="p-2 text-center px-6">Category</td>
                      <td className="p-2 text-center px-6">Creator</td>
                      <td className="p-2 text-center px-6">Views Count</td>
                      <td className="p-2 text-center px-6">Lectures Count</td>
                      <td className="p-2 text-center px-6">View Lectures</td>
                      <td className="p-2 text-center px-6">Delete Course</td>
                      <td className="p-2 text-center px-6">Add Lectures</td>
                    </tr>
                  </thead>
                  <tbody>
                    {courses?.map((ele, i) => (
                      <tr key={i} className="text-white text-sm pb-4">
                        <td className="p-2 text-center px-6">{ele.title}</td>
                        <td className="p-2 text-center px-6 capitalize">
                          {ele.category}
                        </td>
                        <td className="p-2 text-center px-6 capitalize">
                          {ele.createdBy}
                        </td>
                        <td className="p-2 text-center px-6">{ele.views}</td>
                        <td className="p-2 text-center px-6 capitalize">
                          {ele.numOfVideos}
                        </td>
                        <td className="p-2 text-center px-6">
                          <Link to={`/admin/course/getlectures/${ele._id}`}>
                            <button className="p-1 bg-blueColor text-white text-sm px-4 rounded-sm hover:bg-hoverColorBlue">
                              View
                            </button>
                          </Link>
                        </td>
                        <td className="p-2 text-center px-6">
                          <button
                            className="p-1 bg-redColor text-white text-sm px-4 rounded-sm hover:bg-red-600"
                            onClick={() => deleteLecture(ele._id)}
                          >
                            Delete
                          </button>
                        </td>
                        <td className="p-2 text-center px-6">
                          <Link
                            to={`/admin/createcourse/addlectures/${ele._id}`}
                          >
                            <button
                              className="p-1 bg-greenColor text-white text-sm px-4 rounded-sm hover:bg-green-700"
                              onClick={() => viewLectures(ele._id)}
                            >
                              Add Lectures
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
      )
    </>
  );
};

export default AdminCourse;
