import React, { memo } from 'react'


const ChoiceExtract = ({choice, setChoice, setPagesNumber, setNewChoice, handlePageBehaviour}) => {
    console.count() 
    console.log('choice component re-render') 
  return (
    <>
    <form>
        <fieldset>
          <legend>
          Would like to extract a range of page or a scattered pages?
          </legend>
          
          <input
            type="radio"
            name="range"
            id="range-choice"
            value="range"
            onChange={(e)=> {
              setChoice(e.target.value)
              setPagesNumber('')
              handlePageBehaviour()
            }}
            checked={choice === 'range'}
            key="range"
          />
       
          <label htmlFor="range-choice">
            Range
          </label>
          <br />
          
          <input
            type="radio"
            name="scattered"
            id="scattered-choice"
            value="scattered"
            onChange={(e)=> {
              setChoice(e.target.value)
              setPagesNumber('')
              handlePageBehaviour()
            }}
            checked={choice === 'scattered'}
            key="scattered"
          />
          <label htmlFor="scattered-choice">
          Scattered
          </label>
        </fieldset>
      </form>
    </>
  )
}

export default ChoiceExtract;

export const MemorizedChoiceExtract = memo(ChoiceExtract)