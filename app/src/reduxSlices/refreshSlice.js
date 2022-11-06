import { createSlice } from '@reduxjs/toolkit';

export const refreshSlice = createSlice({
    name: 'refresh',
    initialState: {
        value: false
    },
    reducers: {
        refreshWindow: (state, action) => {
            state.value = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { refreshWindow } = refreshSlice.actions;

export default refreshSlice.reducer;
