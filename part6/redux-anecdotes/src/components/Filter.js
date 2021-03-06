import { connect } from "react-redux"

import { filterList } from "../reducers/filterReducer"

const Filter = (props) => {

  const handleChange = (event) => {
    // input-field value is in variable event.target.value
    event.preventDefault()
    const inputVal = event.target.value

    props.filterList(inputVal)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const mapDispatchToProps = {
  filterList
}

const ConnectedFilter = connect(
  null,
  mapDispatchToProps
)(Filter)
export default ConnectedFilter