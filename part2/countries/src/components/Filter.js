import React from 'react'

const Filter = (props) => (
    <div>find countries <input
                                value={props.search}
                                onChange={props.handleSearch}
                            />
    </div>  
)

export default Filter