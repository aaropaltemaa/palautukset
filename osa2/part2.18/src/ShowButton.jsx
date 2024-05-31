const ShowButton = ({ handleShowOneToggle, showOneCountry }) => {
    return (
      <button onClick={handleShowOneToggle}>
        {showOneCountry ? 'hide' : 'show'}
      </button>
    )
  }
  
  export default ShowButton
  