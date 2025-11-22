import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "@/apis/product";

const initState = {
  inputValue: "",
  inputImage: "",
  loading: false,
  result: [],
};

export const searchByKeyword = createAsyncThunk(
  'search/searchByKeyword',
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await getProducts({ keyword: keyword });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: initState,
  reducers: {
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    setInputImage: (state, action) => {
      state.inputImage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setResult: (state, action) => {
      state.result = action.payload;
    },
    clearSearch: (state) => {
      state.inputValue = "";
      state.result = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchByKeyword.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(searchByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.result = []; 
      });
  },
});

export const { setInputValue, setInputImage, setLoading, setResult, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;