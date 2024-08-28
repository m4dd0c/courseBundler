import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteLectureFromACourseAction,
  getLecturesOfACourseAction,
} from "../../redux/actions/adminAction";
import Loader from "../layout/Loader";

const GetLecturesPage = () => {
  const dispatch = useDispatch();
  const { lectures } = useSelector((state) => state.adminReducer);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getLecturesOfACourseAction(id));
  }, [dispatch, id]); // id added

  const deleteLecture = async (lectureId) => {
    await dispatch(deleteLectureFromACourseAction(id, lectureId));
    dispatch(getLecturesOfACourseAction(id));
  };
  const nav = useNavigate();
  const viewLecture = () => {
    nav(`/course/${id}`);
  };

  const { loading } = useSelector((state) => state.globalReducer);
  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="bg-[#1D232A] min-h-screen pb-16">
        <h1 className="text-center text-5xl text-white py-14 font-bold">
          Video Lecture
        </h1>
        <div className="grid place-content-center ">
          <table>
            <tr className="font-light pb-4 text-center">
              <td className="p-2 text-center px-6 capitalize text-cyanColor">
                ID
              </td>
              <td className="p-2 text-center px-6 capitalize text-cyanColor">
                Lecture Name
              </td>
              <td className="p-2 text-center px-6 capitalize text-cyanColor">
                Description
              </td>
              <td className="p-2 text-center px-6 capitalize text-cyanColor">
                View Action
              </td>
              <td className="p-2 text-center px-6 capitalize text-cyanColor">
                Delete Action
              </td>
            </tr>
            {lectures?.map((curr, i) => {
              return (
                <tr key={i} className="text-center">
                  <td className="text-white capitalize text-center px-6 p-2">
                    {i + 1}
                  </td>
                  <td className="text-white capitalize text-center px-6 p-2">
                    {curr?.title}
                  </td>
                  <td className="text-white capitalize text-center px-6 p-2">
                    {curr?.description}
                  </td>
                  <td>
                    <button
                      onClick={viewLecture}
                      className=" p-1 bg-greenColor text-white text-sm px-4 rounded-sm hover:bg-green-700"
                    >
                      View Lecture
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteLecture(curr._id)}
                      className=" p-1 bg-redColor text-white text-sm px-4 rounded-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </>
  );
};

export default GetLecturesPage;
