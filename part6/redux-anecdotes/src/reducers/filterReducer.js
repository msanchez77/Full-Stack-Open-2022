import { createSlice } from "@reduxjs/toolkit"

const initialState = ''

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterList(state, action) {
      return action.payload
    }
	}
})

export const { filterList } = filterSlice.actions
export default filterSlice.reducer