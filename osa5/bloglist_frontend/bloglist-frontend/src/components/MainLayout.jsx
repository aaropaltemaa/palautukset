import Notification from './Notification'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const MainLayout = ({ user, blogForm, blogs, loginForm }) => {
    if (user === null) {
        return (
            <div>
                <Notification />
                <div>
                    <h2>log in to application</h2>
                    {!user && loginForm()}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <Notification />
                <h2 className="h2 bloglist">Blog list</h2>
                {blogForm()}
                <h2 className="h2 blogs">Blogs</h2>
                <Table striped>
                    <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog.id}>
                                <td>
                                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default MainLayout