import { useEffect, useState } from "react";
import SingleCourse from "./SingleCourse.jsx";
import {
  addToPlaylistAction,
  getAllCoursesAction,
} from "../../redux/actions/courseActions.js";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../redux/actions/userActions.js";

const AllCourses = () => {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courseReducer);
  const categories = [
    "Web Development",
    "Artificial Intelligence",
    "Data Structure & Algorithm",
    "App Development",
    "Data Science",
    "Game Development",
  ];

  useEffect(() => {
    dispatch(getAllCoursesAction(keyword));
  }, [dispatch]);

  const addToPlaylistHandler = async (id) => {
    // console.log(id)
    await dispatch(addToPlaylistAction(id));
    dispatch(loadUser());
  };

  const searchHandler = () => {
    dispatch(getAllCoursesAction(keyword));
  };

  return (
    <>
      <div className="bg-lightColor min-h-[800px]">
        <div>
          <div>
            <h1 className="text-center text-5xl text-white py-10 font-bold">
              All Available Courses
            </h1>
            <div className="grid place-content-center pb-10">
              <div>
                <input
                  type="text"
                  className="border-0 bg-lightWhite outline-none w-[400px] p-2 h-[68%] rounded-sm"
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                />
                <button
                  type="submit"
                  onClick={searchHandler}
                  className="text-white bg-cardColor m-2 px-4 py-2 rounded-sm w-max hover:bg-hoverColor"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            {categories.map((elem, i) => (
              <button
                onClick={() => dispatch(getAllCoursesAction(elem))}
                key={i}
                className="p-2 px-5 mx-2 bg-cardColor rounded-lg w-fit text-white"
              >
                {elem}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="p-10 flex flex-wrap justify-center gap-10">
            {courses?.map((c, i) => {
              return (
                <SingleCourse
                  key={i}
                  title={c?.title}
                  description={c?.description}
                  views={c?.views}
                  imageSrc={c?.poster?.url}
                  id={c?._id}
                  creator={c?.createdBy}
                  lectureCount={c?.numOfVideos}
                  category={c?.category}
                  addToPlaylistHandler={addToPlaylistHandler}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCourses;
