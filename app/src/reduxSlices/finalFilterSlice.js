import { createSlice } from '@reduxjs/toolkit';

export const finalFilterSlice = createSlice({
    name: 'finalFilter',
    initialState: {
        experience: 0,
        salary: [50, 300],
        education: [true, true, true],
        h1b: true
    },
    reducers: {
        updateFinalFilters: (state, action) => {
            let updated_state = action.payload;
            state.experience = updated_state.experience;
            state.salary = updated_state.salary;
            state.education = updated_state.education;
            state.h1b = updated_state.h1b;
        }
    }
});

// Action creators are generated for each case reducer function
export const { updateFinalFilters } = finalFilterSlice.actions;

export default finalFilterSlice.reducer;
