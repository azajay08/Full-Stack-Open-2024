const filterReducer = (state = '', action) => {
  switch(action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}
export const filterChange = (filterInput) => {
  return {
      type: 'SET_FILTER',
      payload: filterInput,
  }
}

export default filterReducer