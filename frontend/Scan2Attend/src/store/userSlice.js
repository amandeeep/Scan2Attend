import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData :JSON.parse( localStorage.getItem('userData')) || null
    },
    reducers:{
        addUser:(state, action) => {
            state.userData = action.payload;
            localStorage.setItem('userData', JSON.stringify(action.payload));
        },
        loadUser: (state) => {
            const save = localStorage.getItem('userData');
            if(save !== null) state.userData = JSON.parse(save)
        },
        removeUser: (state, action) => {
            localStorage.removeItem('userData');
            state.userData = null;
        }
    }
})

export const {addUser, removeUser, loadUser} = userSlice.actions;
export default userSlice.reducer;