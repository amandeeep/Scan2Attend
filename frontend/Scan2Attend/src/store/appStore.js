import { configureStore } from '@reduxjs/toolkit'
import themeR from './themeSlice'; // we can give any name to default export theme/themeReducer/apple/mango/etc
import userReducer from './userSlice'

  const appStore = configureStore({
  reducer: {
    theme:themeR,
    user:userReducer
  },
  
})

export default appStore;
