import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId; //? Optional ID field
  name: string;
  email: string;
  password?: string;
  mobile?: string; //? optional mobile field
  role: "user" | "admin" | "deliveryBoy";
}

interface IUserSlice {
  userData: IUser | null;
}

const initialState: IUserSlice = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //? to change any data it will change using reducers
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
