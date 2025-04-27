import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const token = Cookies.get("jwt");
const initialState = {
  isLoggedIn: !!token,
  user: token ? jwtDecode(token) : null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token } = action.payload;
      Cookies.set("jwt", token, { expires: 7 });
      state.isLoggedIn = true;
      state.user = jwtDecode(token);
    },
    logout: (state) => {
      Cookies.remove("jwt");
      state.isLoggedIn = false;
      state.user = null;
      state.isAdmin = false;
    },
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    setUser: (state, action) => {

      state.user = action.payload;
    },
  },
});

export const { login, logout, setAdmin, setUser } = authSlice.actions;
export default authSlice.reducer;
