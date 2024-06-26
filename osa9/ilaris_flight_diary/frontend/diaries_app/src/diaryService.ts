import axios from "axios";
import { Diary, NewDiary } from "./types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaries = async () => {
  const response = await axios.get<Diary[]>(baseUrl);
  return response.data;
};

export const addDiary = async (newDiary: NewDiary) => {
  try {
    const response = await axios.post<Diary>(baseUrl, newDiary);
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { error: error.response.data };
    }
    return { error: "An unexpected error occurred" };
  }
};
