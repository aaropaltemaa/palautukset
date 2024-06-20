const LikeButton = ({ blog, handleLike }) => (
  <button onClick={() => handleLike(blog)}>like</button>
)

export default LikeButton
