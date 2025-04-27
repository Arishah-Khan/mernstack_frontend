import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskModal from '../components/taskModels';
import { ToastContainer, toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);  // Ensure tasks is initialized as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/tasks`);
      console.log(response.data);  // Log to verify the data structure
      if (Array.isArray(response.data)) {  // Check if the response is an array
        setTasks(response.data);  // Only set tasks if it's an array
      } else {
        toast.error('Invalid task data!');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks!');
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const handleAddTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/tasks`, taskData);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      toast.success('Task added successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error adding task!');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const handleUpdateTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/tasks/${taskData._id}`, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskData._id ? response.data : task))
      );
      toast.success('Task updated successfully!');
      setIsModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error updating task!');
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task!');
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop reordering of tasks
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Ensure tasks is always an array before proceeding
    if (Array.isArray(tasks)) {
      const updatedTasks = [...tasks];
      const [movedTask] = updatedTasks.splice(source.index, 1);
      movedTask.status = destination.droppableId;

      updatedTasks.splice(destination.index, 0, movedTask);

      setTasks(updatedTasks);

      try {
        await axios.put(`${apiUrl}/tasks/${movedTask._id}`, movedTask);
        toast.success('Task status updated!');
      } catch (error) {
        console.error('Error updating task status:', error);
        toast.error('Error updating task status!');
      }
    } else {
      console.error('Tasks is not an array.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-board-container p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#222d52]">TaskifyX</h1>
        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-8 py-3 bg-[#d2b68a] text-[#222d52] rounded-lg font-semibold hover:bg-[#eee5d9] transition-colors duration-300"
        >
          Add Task
        </button>
      </header>

      {loading && (
        <div className="flex justify-center items-center">
          <BounceLoader color="#3498db" loading={loading} size={60} />
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-6">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="task-column bg-white p-4 rounded-lg shadow-lg w-1/3"
                >
                  <h2 className="text-xl font-semibold mb-4">{status}</h2>
                  {Array.isArray(tasks) && tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-card bg-gray-50 p-4 mb-4 rounded-lg shadow hover:bg-gray-100 transition duration-300"
                          >
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => {
                                  setTaskToEdit(task);
                                  setIsModalOpen(true);
                                }}
                                className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleAddTask}
        taskToEdit={taskToEdit}
        onUpdate={handleUpdateTask}
      />

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default TaskBoard;
