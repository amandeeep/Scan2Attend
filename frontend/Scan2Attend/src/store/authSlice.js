import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: JSON.parse(localStorage.getItem("isAuth")) || false,
    isOnboarded: JSON.parse(localStorage.getItem("isOnboarded")) || false,
    isRole: localStorage.getItem("isRole") || null
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
      localStorage.setItem("isAuth", JSON.stringify(action.payload));
    },

    

    setOnboard: (state, action) => {
      state.isOnboarded = action.payload;
      localStorage.setItem("isOnboarded", JSON.stringify(action.payload));
    },

    setIsRole: (state, action) => {
        state.isRole = action.payload;
        localStorage.setItem('isRole', action.payload)
    },

    loadAuth: (state) => {
      const saved = localStorage.getItem("isAuth");
      const onSave = localStorage.getItem("isOnboarded");
      const rSave = localStorage.getItem("isRole");


      if (saved !== null) {
        state.isAuthenticated = JSON.parse(saved);
      }
      if (onSave !== null) {
        state.isOnboarded = JSON.parse(onSave);
      }
      if(rSave !== null) {
        state.isRole = rSave
      }
    },

    removeAuth: (state) => {
      localStorage.removeItem("isAuth");
      localStorage.removeItem("isOnboarded");
      localStorage.removeItem('isRole');
      state.isAuthenticated = false;
      state.isOnboarded = false;
      state.isRole = null;
    },
  },
});

export const { setAuth, setOnboard, loadAuth, removeAuth, setIsRole } = authSlice.actions;
export default authSlice.reducer;
