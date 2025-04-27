import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskModal from '../components/taskModels';
import { ToastContainer, toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastId, setToastId] = useState(null);  
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/tasks`);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        toast.error('Invalid task data received from server!');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks from server!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add tasks!');
      navigate('/login');
      return;
    }

    setLoading(true);
    const currentToastId = toast.loading('Adding task...', { autoClose: false });
    setToastId(currentToastId); 
    try {
      const response = await axios.post(`${apiUrl}/tasks`, taskData);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      toast.update(currentToastId, {
        render: 'Task added successfully!',
        type: 'success',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast.update(currentToastId, {
        render: 'Error adding task!',
        type: 'error',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setTimeout(() => toast.dismiss(currentToastId), 3500); 
      setIsModalOpen(false); 
    }
  };

  const handleUpdateTask = async (taskData) => {
    setLoading(true);
    const currentToastId = toast.loading('Updating task...', { autoClose: false });
    setToastId(currentToastId);
    try {
      const response = await axios.put(`${apiUrl}/tasks/${taskData._id}`, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskData._id ? response.data : task))
      );
      toast.update(currentToastId, {
        render: 'Task updated successfully!',
        type: 'success',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast.update(currentToastId, {
        render: 'Error updating task!',
        type: 'error',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setTimeout(() => toast.dismiss(currentToastId), 3500);
      setIsModalOpen(false);
      setTaskToEdit(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setLoading(true);
    const currentToastId = toast.loading('Deleting task...', { autoClose: false });
    setToastId(currentToastId);
    try {
      await axios.delete(`${apiUrl}/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      toast.update(currentToastId, {
        render: 'Task deleted successfully!',
        type: 'success',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.update(currentToastId, {
        render: 'Error deleting task!',
        type: 'error',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setTimeout(() => toast.dismiss(currentToastId), 3500); 
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (source.index === destination.index && source.droppableId === destination.droppableId) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);
    setTasks(updatedTasks);

    try {
      await axios.put(`${apiUrl}/tasks/${movedTask._id}`, movedTask);
      const currentToastId = toast.success('Task status updated successfully!');
      setTimeout(() => {
        toast.dismiss(currentToastId);
      }, 3000);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error updating task status!');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#222d52] p-6">
<motion.header
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-8"
>
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#d2b68a] text-center sm:text-left py-3 md:py-6">
  TaskifyX - Your Task Manager  </h1>
  <button
    onClick={() => {
      if (isLoggedIn) {
        setTaskToEdit(null);
        setIsModalOpen(true);
      } else {
        toast.error('Please log in to add tasks!');
        navigate('/login');
      }
    }}
    className="mt-4 sm:mt-0 sm:px-6 px-4 py-2 bg-[#d2b68a] text-[#222d52] rounded-lg font-semibold hover:bg-[#c5a97d] transition-colors w-full sm:w-auto"
  >
    Add Task
  </button>
</motion.header>


      {loading ? (
        <div className="flex justify-center items-center h-60">
          <BounceLoader color="#d2b68a" loading={loading} size={60} />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {['To Do', 'In Progress', 'Done'].map((status) => (
              <Droppable key={status} droppableId={status}>
  {(provided) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className="bg-[#211e3b] p-4 rounded-lg shadow-lg border-2 border-[#d2b68a]" // Added border class here
    >
      <h2 className="text-xl font-bold text-white mb-4">{status}</h2>
      {Array.isArray(tasks) && tasks
        .filter((task) => task.status === status)
        .map((task, index) => (
          <Draggable key={task._id} draggableId={task._id} index={index}>
            {(provided) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="bg-[#222d52] p-4 mb-4 rounded-lg shadow hover:bg-[#485587] transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-semibold text-[#d2b68a]">{task.title}</h3>
                <p className="text-sm text-gray-300">{task.description}</p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => {
                      setTaskToEdit(task);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </Draggable>
        ))}
      {provided.placeholder}
    </div>
  )}
</Droppable>

            ))}
          </motion.div>
        </DragDropContext>
      )}

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTask}
          taskToEdit={taskToEdit}
          onUpdate={handleUpdateTask}
        />
      )}

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default TaskBoard;
