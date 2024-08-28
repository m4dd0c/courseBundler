import { instance } from "../store";
import { rej, req, res } from "../reducers/globalReducer";

export const profileUpdateAction = (formdata) => async (dispatch) => {
  try {
    dispatch(req());
    const { data } = await instance.put("/updateprofile", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(res(data));
  } catch (error) {
    dispatch(rej(error?.response?.data?.message));
  }
};

export const changePasswordAction =
  (oldPassword, newPassword) => async (dispatch) => {
    try {
      dispatch(req());
      const { data } = await instance.put("/changepassword", {
        oldPassword,
        newPassword,
      });
      dispatch(res(data));
    } catch (error) {
      dispatch(rej(error?.response?.data?.message));
    }
  };

export const forgetPasswordAction = (email) => async (dispatch) => {
  try {
    dispatch(req());
    const { data } = await instance.post("/forgetpassword", { email });
    dispatch(res(data));
  } catch (error) {
    dispatch(rej(error?.response?.data?.message));
  }
};

export const resetPasswordAction =
  (token, newPassword, confirmPassword) => async (dispatch) => {
    try {
      dispatch(req());
      const { data } = await instance.put(`/resetpassword/${token}`, {
        newPassword,
        confirmPassword,
      });
      dispatch(res(data));
    } catch (error) {
      dispatch(rej(error?.response?.data?.message));
    }
  };

export const removeFromPlaylistAction = (courseId) => async (dispatch) => {
  try {
    dispatch(req());
    const { data } = await instance.delete(
      `/removefromplaylist?courseId=${courseId}`,
    );
    dispatch(res(data));
  } catch (error) {
    dispatch(rej(error?.response?.data?.message));
  }
};
