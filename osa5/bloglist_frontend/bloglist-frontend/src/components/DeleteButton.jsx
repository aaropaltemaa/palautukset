const DeleteButton = ({ handleDelete, id, showDelete }) => {
  if (!showDelete) {
    return null
  }
  return <button data-testid="delete-button" onClick={() => handleDelete(id)}>remove</button>
}

export default DeleteButton
