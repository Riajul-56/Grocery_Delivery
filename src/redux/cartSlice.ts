import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

export interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal: number;
  deliveryCharge: number;
  finalTotal: number;
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryCharge: 50,
  finalTotal: 50,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add to cart action, it pushes the new item to the cartData array in the state
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },

    // Increase quantity action, it finds the item in the cartData array by its _id and increases its quantity by 1
    increaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((i) => i._id == action.payload);
      if (item) {
        item.quantity = item.quantity + 1;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    // Decrease quantity action, it finds the item in the cartData array by its _id and decreases its quantity by 1. If the quantity becomes less than 1, it removes the item from the cartData array
    decreaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((i) => i._id == action.payload);
      if (item?.quantity && item.quantity > 1) {
        item.quantity = item.quantity - 1;
      } else {
        state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    // Remove from cart action, it filters out the item from the cartData array by its _id
    removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },

    // Calculate totals action, it calculates the subTotal by summing up the price multiplied by quantity of each item in the cartData array, then it sets the deliveryCharge to 0 if the subTotal is greater than 100, otherwise it sets it to 50, and finally it calculates the finalTotal by adding the subTotal and deliveryCharge
    calculateTotals: (state) => {
      state.subTotal = state.cartData.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );
      state.deliveryCharge = state.subTotal > 100 ? 0 : 50;
      state.finalTotal = state.subTotal + state.deliveryCharge;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
