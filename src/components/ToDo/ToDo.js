import React from "react";
import { useEffect, useState } from "react";
import "./ToDo.css";
import { Button, Card, ListGroup, ListGroupItem } from "reactstrap";
import { FcTodoList } from "react-icons/fc";
import { supabase } from "../Client/client";
import { TiDeleteOutline } from "react-icons/ti";
import ToDoDetail from "./ToDoDetail";
import App from "../../App";
import Home from "../Home";


export default function ToDo(props) {

  const [count] = useState(0);
  const [todos, setTodos] = useState([]);


  const selectTodos = async () => {
    let { data } = await supabase
      .from("todo_task")
      .select("*")
      .order("task_id", { ascending: false });
    setTodos(data);
  };

  useEffect(() => {
    selectTodos();
  }, []);

  return (
    <div className="Todo-card">
      <nav></nav>
      <h2>My Todo List</h2>
      
      <div className="List-view">
        {todos &&
          todos.map((todoItem) => (
            <Todo key={todoItem.task_id} {...todoItem} setTodos={setTodos} props/>
            
          ))}
      </div>
      <AddTodo setTodos={selectTodos} />
    </div>
  );
}
const AddTodo = ({ setTodos }) => {
  const [task, setTask] = useState("");
  const onSubmit = (event) => {
    event.preventDefault();
    if (task === "") return;
    supabase
      .from("todo_task")
      .insert({ task: task, user_id: supabase.auth.user().id })
      .single()
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setTodos((prevTodos) => [data, ...prevTodos]);
        }
      });
  };


  // const btn = document.getElementById("btn");
  // btn.addEventListener("click", function handleClick(event) {
  //   event.preventDefault();
  //   const text = document.getElementById("text");
  //   console.log(text.value);
  //   text.value = "";
  // });
  return (
    <form className="Input-container">
      <input
        task_id="text"
        className="Input-field App-border-radius"
        placeholder="Task Description"
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        task_id="btn"
        type="submit"
        onClick={onSubmit}
        className="App-button Add-button App-border-radius"

      >
        Add
      </button>
    </form>
    
  );
};

const Todo = ({ task_id, is_completed, task: task, setTodos, index }, props) => {

  function handleClick (e) {
    console.log(task_id);
    <ToDoDetail task_id={task_id}/>
    e.preventDefault();
    props.task_id=task_id;
    console.log(props.task_id);
  }


  const [todo, setTodo] = useState(task);
  const [completed, setCompleted] = useState(is_completed);
  

  const onEditTodo = (task_id) => {
    if (todo === "") return;
    supabase
      .from("todo_task")
      .update({ task: todo })
      .match({ task_id })
      .then((value, error) => {
        console.log(value, error);
      });
  };

  const onCompleteTodo = (task_id) => {
    supabase
      .from("todo_task")
      .update({ is_completed: !completed })
      .match({ task_id })
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setCompleted((prev) => !prev);
        }
      });
  };

  const onDeleteTodo = async () => {
    const { error } = await supabase.from("todo_task").delete().match({ task_id });
    if (!error) {
      setTodos((prev) => {
        return prev.filter((todoItem) => {
          return todoItem.task_id !== task_id;
        });
      });
    }
  };

  return (
    <div key={task_id} className="List-tile App-border-radius">
      {task_id}.{task.name}
      <input
        style={{
          width: "100%",
          height: "1.75rem",
          fontSize: "1.5rem",
          background: "transparent",
          border: "0.02rem solid black",
          borderRadius: 8,
          paddingLeft: 8,
        }}
        value={todo}
        onChange={(e) => {
          const { value } = e.target;
          setTodo(value);
        }}
      />
      <a  onClick={handleClick} className="details"> Details </a>

    </div>
  );
};
