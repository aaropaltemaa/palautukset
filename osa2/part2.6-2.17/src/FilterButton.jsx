const FilterButton = ({ handleShowAllToggle, showAll }) => {
    return (
      <button onClick={handleShowAllToggle}>
        {showAll ? 'Show Only Capitalized' : 'Show All'}
      </button>
    )
  }
  
  export default FilterButton
  