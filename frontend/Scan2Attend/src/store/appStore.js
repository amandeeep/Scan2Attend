import { configureStore } from '@reduxjs/toolkit'
import themeR from './themeSlice'; // we can give any name to default export theme/themeReducer/apple/mango/etc

  const appStore = configureStore({
  reducer: {
    theme:themeR,
  },
  
})

export default appStore;
