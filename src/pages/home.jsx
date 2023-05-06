import * as React from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { animated } from "react-spring";
// import { useWiggle } from "../hooks/wiggle";
// import { Link } from "wouter";
import { useLocalStorage } from "../hooks/local-storage"
import Task from "../components/Task"


export default function Home() {
  const [text, setText] = React.useState("")
  const [tasks, setTasks] = useLocalStorage("tasks", [])
  const [taskId, setTaskId] = useLocalStorage("taskId", 0)
  
  function changeText(event) {
    setText(event.target.value)
  }
  
  
  function addTask(e) {
    e.preventDefault()
    if (text.trim() !== "") {
      setTaskId(prevState => prevState + 1)
      setTasks(prevState => {
        return prevState.concat({content: text.trim(), finished: true, id: taskId})
      })
    }
  }
  
  function toggleCompletion(id) {
    setTasks(prevState => {
      const newState = prevState.map((obj) => ({...obj}))
      const task = newState.find((task => task.id === id))
      task.finished = !task.finished
      return newState
    })
  }
  
  function removeTask(id) {
    setTasks(prevState => {
      // const newState = prevState.map((obj) => ({...obj}))
      // newState.splice(index, 1)
      // return newState
      const index = prevState.findIndex((task => task.id === id))
      return [...prevState.slice(0, index), ...prevState.slice(index + 1)]
    })
  }
  
  function onChangeText(id, text) {
    setTasks(prevState => {
      const newState = prevState.map((obj) => ({...obj}))
      const task = newState.find((task => task.id === id))
      task.content = text
      return newState
    })
  }
  
  function handleOnDragEnd(result) {
    // https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/#step-2-making-a-list-draggable-and-droppable-with-react-beautiful-dnd
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTasks(items)
  }
  
  const listItems = tasks.map((task, i) => {
    return (
      <Draggable key={task.id} draggableId={"" + task.id} index={i}>
        {(provided) => (
          <Task 
              content={task.content} 
              finished={task.finished} 
              id={task.id}
              toggleCompletion={toggleCompletion}
              removeTask={removeTask}
              onChangeText={onChangeText}
              provided={provided} 
              innerRef={provided.innerRef}/>
        )}
      </Draggable>
      )
  })
  
  return (<>  <h3>To Do List</h3> 
      <div className="input-container">
        <form onSubmit={addTask}>
          <input onChange={changeText} value={text}/>
          <input type="submit" value="Add Task"/>
        </form>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
        { (provided) => {
            return <ul className="task-list" provided={provided} ref={provided.innerRef}> {listItems} {provided.placeholder}</ul>
          }
        }
        </Droppable>
      </DragDropContext>
      
  </>)
};
