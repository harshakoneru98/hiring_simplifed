import { createSlice } from '@reduxjs/toolkit';

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        experience: 0,
        salary: [50, 300]
    },
    reducers: {
        modifyExperience: (state, action) => {
            state.experience = action.payload;
        },
        modifySalary: (state, action) => {
            state.salary = action.payload;
        },
        updateFilters: (state, action) => {
            let updated_state = action.payload;
            state.experience = updated_state.experience;
            state.salary = updated_state.salary;
        }
    }
});

// Action creators are generated for each case reducer function
export const { modifyExperience, modifySalary, updateFilters } =
    filterSlice.actions;

export default filterSlice.reducer;
