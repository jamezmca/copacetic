import React from 'react'

export default function ProgressBar(props) {
  const { text, remainder } = props
  // const text = 'hello world' // come and change this later you silly muppet

  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className='level'>
      <div>
        <h4>{text}</h4>
      </div>

      {arr.map((element, elementIdx) => {
        return (
          <div className='level-bar' key={elementIdx}></div>
        )
      })}

      <div className='xp' style={{ width: `${remainder}%` }}  ></div>

    </div>
  )
}
