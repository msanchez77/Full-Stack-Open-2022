import { useSelector } from "react-redux";

import {
  Link
} from "react-router-dom"

const UserRow = ({ name, num, id }) => {
  return (
    <tr>
      <td><Link to={`/users/${id}`}>{name}</Link></td>
      <td>{num}</td>
    </tr>
  )
}

const UserTable = ({ database }) => {

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {database.map(entry => 
          <UserRow 
            key={entry.id}
            name={entry.name}
            num={entry.blogs.length} 
            id={entry.id}
          />
        )}
      </tbody>
    </table>
  )
}

const Users = () => {

  const database = useSelector(state => state.database)


  return (
    <div>
      <h3>Users</h3>

      <UserTable database={database} />
    </div>
  );

};

export default Users