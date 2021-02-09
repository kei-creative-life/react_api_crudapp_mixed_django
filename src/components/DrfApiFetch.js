import React, { useState, useEffect } from "react";
import axios from "axios";

const DrfApiFetch = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [editedTask, setEditedTask] = useState({ id: "", title: "" });
  const [id, setId] = useState(1);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/tasks/", {
        headers: {
          Authorization: "Token 326e61127b7fffe09da65baa095a08a07768e382",
        },
      })
      .then((response) => {
        setTasks(response.data);
      });
  }, []);

  const getTask = () => {
    axios
      .get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        headers: {
          Authorization: "Token 326e61127b7fffe09da65baa095a08a07768e382",
        },
      })
      .then((response) => {
        setSelectedTask(response.data);
      });
  };

  const newTask = (task) => {
    const data = {
      title: task.title,
    };
    axios
      .post("http://127.0.0.1:8000/api/tasks/", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 326e61127b7fffe09da65baa095a08a07768e382",
        },
      })
      .then((response) => {
				setTasks([...tasks, response.data]);
				setEditedTask({id: '', title: ''})
      });
  };

  const editTask = (task) => {
    axios
      .put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 326e61127b7fffe09da65baa095a08a07768e382",
        },
      })
      .then((response) => {
        setTasks(
          tasks.map((task) =>
            task.id === editedTask.id ? response.data : task
          )
        );
        setEditedTask({ id: "", title: "" });
      });
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        headers: {
          Authorization: "Token 326e61127b7fffe09da65baa095a08a07768e382",
        },
      })
      .then((response) => {
        setTasks(tasks.filter((task) => task.id !== id));
        setSelectedTask([]);
      });
  };

  const handleInputChange = () => (e) => {
    const value = e.target.value;
    setEditedTask({ ...editedTask, title: value });
  };

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} {task.id}
            <button onClick={() => deleteTask(task.id)}>
              <i className="fas fa-trash-alt"></i>
            </button>
            <button onClick={() => setEditedTask(task)}>
              <i className="fas fa-pen"></i>
            </button>
          </li>
        ))}
      </ul>
      Set id <br />
      <input
        type="text"
        value={id}
        onChange={(e) => {
          setId(e.target.value);
        }}
      />
      <br />
      <button type="button" onClick={() => getTask()}>
        Get Task
      </button>
      <h3>
        {selectedTask.title} {selectedTask.id}
      </h3>
      <input
        type="text"
        name="title"
        value={editedTask.title}
        onChange={handleInputChange()}
        placeholder="New task ?"
        required
      />
      {editedTask.id ? (
        <button onClick={() => editTask(editedTask)}>Update</button>
      ) : (
        <button onClick={() => newTask(editedTask)}>Create</button>
      )}
    </div>
  );
};

export default DrfApiFetch;
