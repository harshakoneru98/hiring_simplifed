import { createSlice } from '@reduxjs/toolkit';
import { defaultValues } from '../config';

export const filterSlice = createSlice({
    name: 'filter',
    initialState: defaultValues,

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
        modifyStates: (state, action) => {
            state.states = action.payload;
        },
        modifyCompanies: (state, action) => {
            state.company_to_company_types = action.payload;
        },
        modifySort: (state, action) => {
            state.sortValues = action.payload;
        },
        updateFilters: (state, action) => {
            let updated_state = action.payload;
            state.experience = updated_state.experience;
            state.salary = updated_state.salary;
            state.education = updated_state.education;
            state.h1b = updated_state.h1b;
            state.job_family = updated_state.job_family;
            state.company_to_company_types =
                updated_state.company_to_company_types;
            state.sortValues = updated_state.sortValues;
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
    modifyStates,
    modifyCompanies,
    modifySort,
    updateFilters
} = filterSlice.actions;

export default filterSlice.reducer;
