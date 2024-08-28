import { useState } from "react";
import SideBar from "./SideBar";
import { getAllCoursesAction } from "../../redux/actions/courseActions";
import { useDispatch, useSelector } from "react-redux";
import { createCourseAction } from "../../redux/actions/adminAction";
import Loader from "../layout/Loader";
import { useNavigate } from "react-router-dom";

const CreateCoures = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    createdBy: "",
    category: "Web Development",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState("");
  const dispatch = useDispatch();

  const categories = [
    "Web Development",
    "Artificial Intelligence",
    "Data Structure & Algorithm",
    "App Development",
    "Data Science",
    "Game Development",
  ];

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const imageClickInputHandler = () => {
    const signUpAvatar = document.getElementById("signUpAvatar");
    signUpAvatar.click();
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };
  const nav = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("title", input.title);
    myForm.append("description", input.description);
    myForm.append("createdBy", input.createdBy);
    myForm.append("category", input.category);
    myForm.append("file", image);
    await dispatch(createCourseAction(myForm));
    await dispatch(getAllCoursesAction());
    nav("/admin/admincourse");
  };
  const { loading } = useSelector((state) => state.globalReducer);
  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="bg-[#1D232A] h-full pb-20">
        <h1 className="text-center text-5xl text-white py-14 font-bold">
          Create New Course
        </h1>
        <div className="mb-10">
          <SideBar />
        </div>
        <div className="grid place-content-center">
          <form
            onSubmit={submitHandler}
            className="p-8 bg-cardColor rounded-xl w-[500px]"
          >
            <div>
              <div className="my-4">
                <label htmlFor="" className="text-dullWhite block w-[100%]">
                  Course Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={input.title}
                  onChange={inputHandler}
                  className="bg-slate-300 rounded-sm w-full h-[35px] outline-none p-2"
                />
              </div>
              <div className="my-4">
                <label htmlFor="" className="text-dullWhite block w-[100%]">
                  Course Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={inputHandler}
                  className="bg-slate-300 rounded-sm w-full h-[35px] outline-none p-2"
                />
              </div>
              <div className="my-4">
                <label htmlFor="" className="text-dullWhite block w-[100%]">
                  Creator Name
                </label>
                <input
                  type="text"
                  name="createdBy"
                  value={input.createdBy}
                  onChange={inputHandler}
                  className="bg-slate-300 rounded-sm w-full h-[35px] outline-none p-2"
                />
              </div>
              <div className="my-4">
                <label htmlFor="" className="text-dullWhite block w-[100%]">
                  Category
                </label>
                <select
                  name="category"
                  id=""
                  onChange={inputHandler}
                  className="w-full h-[35px] bg-slate-300 px-1 text-black border-none rounded-sm"
                >
                  {categories.map((ele, i) => (
                    <option key={i} value={ele} className="">
                      {ele}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-4">
                <label htmlFor="" className="text-dullWhite block w-[100%]">
                  Choose Course Thumbnail
                </label>
                <label
                  onClick={imageClickInputHandler}
                  className="cursor-pointer hover:bg-hoverColorBlue bg-blueColor rounded-sm w-full h-[35px] outline-none p-2 block text-center text-white"
                >
                  Select Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={imageHandler}
                  id="signUpAvatar"
                  className="hidden"
                />
              </div>
              <div className="my-6 flex justify-center">
                {imagePreview > "" && (
                  <div className="w-1/2 h-32 bg-slate-100 rounded-md overflow-hidden">
                    <img src={imagePreview} alt="" className="w-full h-full" />
                  </div>
                )}
              </div>
              <div className="my-4">
                <button
                  type="submit"
                  className="text-white bg-greenColor rounded-sm w-full h-[35px] border-0 outline-none hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCoures;
