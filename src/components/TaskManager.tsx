import React, { useState, useEffect } from "react";
import "./TaskManager.css";

type Priority = "Low" | "Medium" | "High";

interface Task {
  id: number;
  name: string;
  priority: Priority;
  timeLeft: number; // in seconds
  blinking: boolean;
}

const getSecondsByPriority = (priority: Priority): number => {
  switch (priority) {
    case "High":
      return 3 * 60;
    case "Medium":
      return 5 * 60;
    case "Low":
    default:
      return 7 * 60;
  }
};

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<Priority>("Low");

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev
          .map((task) =>
            task.timeLeft > 0
              ? { ...task, timeLeft: task.timeLeft - 1 }
              : { ...task, blinking: true }
          )
          .filter((task) => {
            // Wait 3 seconds after blinking before removing
            if (task.timeLeft === 0 && task.blinking) {
              setTimeout(() => {
                setTasks((current) => current.filter((t) => t.id !== task.id));
              }, 3000);
            }
            return true;
          })
          .sort((a, b) => a.timeLeft - b.timeLeft)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTask = () => {
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      priority,
      timeLeft: getSecondsByPriority(priority),
      blinking: false,
    };

    setTasks((prev) =>
      [...prev, newTask].sort((a, b) => a.timeLeft - b.timeLeft)
    );
    setTaskName("");
    setPriority("Low");
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="task-manager">
      <h2>📝 Task Manager</h2>
      <div className="task-input">
        <input
          type="text"
          value={taskName}
          placeholder="Enter task name"
          onChange={(e) => setTaskName(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.priority.toLowerCase()} ${
              task.blinking ? "blinking" : ""
            }`}
          >
            <span>{task.name}</span>
            <span>{formatTime(task.timeLeft)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
