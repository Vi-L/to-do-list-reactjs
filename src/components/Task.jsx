import React from "react"

export default function Task({content, finished, id, toggleCompletion, removeTask, onChangeText, provided, innerRef}) {
  const [isFocused, setIsFocused] = React.useState(false)
  return (<li className={isFocused ? "task task-editing" : "task"} {...provided.draggableProps} {...provided.dragHandleProps} ref={innerRef}>
        <div className={isFocused ? "content-editing" : ""}
          contentEditable="true"
          onBlur={(e) => {
            setIsFocused(false)
            onChangeText(id, e.currentTarget.textContent)}} 
          onFocus={() => {setIsFocused(true)}}
          suppressContentEditableWarning={true}>
            {content}
        </div>
        <div>
          <label>
            <input type="checkbox" checked={finished} onChange={() => toggleCompletion(id)}>
            </input>
            {finished ? "Completed" : "Not completed"}
          </label>
          <div><button onClick={() => removeTask(id)}>X</button></div>
        </div>
      </li>)
}
