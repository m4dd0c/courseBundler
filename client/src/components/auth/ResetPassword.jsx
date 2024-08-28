import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPasswordAction } from "../../redux/actions/profileActions.js";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [input, setInput] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const { token } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      resetPasswordAction(token, input.newPassword, input.confirmPassword),
    );
  };

  return (
    <>
      <div className="bg-lightColor min-h-[650px]">
        <h1 className="text-center text-5xl text-white py-14 font-bold">
          Reset Your Password
        </h1>
        <div className="grid place-content-center">
          <div className="p-8 bg-cardColor h-[290px] rounded-xl w-[550px]">
            <div className="my-4">
              <label htmlFor="" className="text-dullWhite block w-[100%]">
                New Password
              </label>
              <input
                type="password"
                onChange={inputHandler}
                name="newPassword"
                value={input.newPassword}
                className="bg-slate-300 rounded-sm w-full h-[35px] outline-none p-2"
              />
            </div>
            <div className="my-4">
              <label htmlFor="" className="text-dullWhite block w-[100%]">
                Confirm Password
              </label>
              <input
                type="password"
                className="bg-slate-300 rounded-sm w-full h-[35px] outline-none p-2"
                onChange={inputHandler}
                name="confirmPassword"
                value={input.confirmPassword}
              />
            </div>
            <div className="my-4">
              <button
                className="cursor-pointer hover:bg-green-700 bg-greenColor rounded-sm w-full h-[35px] outline-none p-2 block text-center text-white"
                onClick={submitHandler}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
