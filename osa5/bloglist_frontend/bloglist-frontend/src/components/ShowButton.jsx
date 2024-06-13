const ShowButton = ({ id, handleShowButton, showBlog }) => {
  return (
    <button onClick={() => handleShowButton(id)}>
      {showBlog ? 'Hide' : 'View'}
    </button>
  )
}

export default ShowButton
