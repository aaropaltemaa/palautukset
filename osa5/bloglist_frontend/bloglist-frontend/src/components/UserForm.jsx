import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const UserForm = ({ users, refreshUsers }) => {
    const [userList, setUserList] = useState(users)

    useEffect(() => {
        setUserList(users)
    }, [users])

    useEffect(() => {
        refreshUsers()
    }, [refreshUsers])

    return (
        <div>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => (
                        <tr key={user.id}>
                            <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserForm