import { createSlice } from '@reduxjs/toolkit';

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        experience: 0,
        salary: [50, 300],
        education: [true, true, true],
        h1b: true,
        job_family: []
    },
    reducers: {
        modifyExperience: (state, action) => {
            state.experience = action.payload;
        },
        modifySalary: (state, action) => {
            state.salary = action.payload;
        },
        modifyEducation: (state, action) => {
            state.education = action.payload;
        },
        modifyH1B: (state, action) => {
            state.h1b = action.payload;
        },
        modifyJobFamily: (state, action) => {
            state.job_family = action.payload;
        },
        updateFilters: (state, action) => {
            let updated_state = action.payload;
            state.experience = updated_state.experience;
            state.salary = updated_state.salary;
            state.education = updated_state.education;
            state.h1b = updated_state.h1b;
            state.job_family = updated_state.job_family;
        }
    }
});

// Action creators are generated for each case reducer function
export const {
    modifyExperience,
    modifySalary,
    modifyEducation,
    modifyH1B,
    modifyJobFamily,
    updateFilters
} = filterSlice.actions;

export default filterSlice.reducer;
