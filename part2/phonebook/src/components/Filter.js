import React from 'react'

const Filter = (props) => (
    <div>filter shown with <input
                                value={props.search}
                                onChange={props.handleSearch}
                            />
    </div>  
)

export default Filter