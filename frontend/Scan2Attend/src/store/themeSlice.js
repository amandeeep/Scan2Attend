import { createSlice } from '@reduxjs/toolkit'
import {THEMES} from '../constants/index';

const initialState ={
    currentTheme: localStorage.getItem("theme") || "light",
    themes: THEMES
};


const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers:{
        setTheme: (state, action) => {
            state.currentTheme = action.payload;
            localStorage.setItem('theme', action.payload)
        },
        loadTheme: (state) => {
            const saved = localStorage.getItem('theme');
            if(saved){
                state.currentTheme = saved;
            }
        }
    }
});

export const {setTheme, loadTheme} = themeSlice.actions;
export default themeSlice.reducer;