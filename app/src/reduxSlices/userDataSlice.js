import { createSlice } from '@reduxjs/toolkit';

export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        value: {}
    },
    reducers: {
        userDataByID: (state, action) => {
            state.value = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { userDataByID } = userDataSlice.actions;

export default userDataSlice.reducer;
