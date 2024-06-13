const Blog = ({ blog }) => {
  return (
    <div className='blog'>
      <p className='blog-title'>{blog.title}</p>
      {blog.showBlog && (
        <>
          <p className='blog-author'>Author: {blog.author}</p>
          <p className='blog-url'>URL: {blog.url}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className='blog-likes'>Likes: {blog.likes}</p>
          </div>
        </>
      )}
    </div>
  )
}
export default Blog
