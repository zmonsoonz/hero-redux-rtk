import { createSlice} from "@reduxjs/toolkit"

const initialState = {
    currentAction: 'all'
}

const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        heroesFilter: (state, action) => {
            state.currentAction = action.payload;
        }
    }
})

const {actions, reducer} = filterSlice;

export default reducer;
export const {
    heroesFilter
} = actions