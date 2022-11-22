import { createSlice } from '@reduxjs/toolkit';
import { defaultValues } from '../config';

export const finalFilterSlice = createSlice({
    name: 'finalFilter',
    initialState: defaultValues,
    reducers: {
        updateFinalFilters: (state, action) => {
            let updated_state = action.payload;
            state.experience = updated_state.experience;
            state.salary = updated_state.salary;
            state.education = updated_state.education;
            state.h1b = updated_state.h1b;
            state.job_family = updated_state.job_family;
            state.states = updated_state.states;
        }
    }
});

// Action creators are generated for each case reducer function
export const { updateFinalFilters } = finalFilterSlice.actions;

export default finalFilterSlice.reducer;
