import { instance } from "../store";
import {
  allCoursesSuccess,
  getCourseLecturesSuccess,
} from "../reducers/courseReducers";
import { rej, req, res } from "../reducers/globalReducer";

export const getAllCoursesAction =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispatch(req());
      const { data } = await instance.get(`/courses?keyword=${keyword}`);
      dispatch(allCoursesSuccess(data));
      dispatch(res(data));
    } catch (error) {
      dispatch(rej(error?.response?.data?.message));
    }
  };

export const addToPlaylistAction = (courseId) => async (dispatch) => {
  try {
    dispatch(req());
    const { data } = await instance.post("/addtoplaylist", { courseId });
    dispatch(res(data));
  } catch (error) {
    dispatch(rej(error?.response?.data?.message));
  }
};

export const getCourseLecturesAction = (id) => async (dispatch) => {
  try {
    dispatch(req());
    const { data } = await instance.get(`/course/${id}`);
    dispatch(getCourseLecturesSuccess(data));
    dispatch(res(data));
  } catch (error) {
    dispatch(rej(error?.response?.data?.message));
  }
};
