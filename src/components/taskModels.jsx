import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TaskModal = ({ isOpen, onClose, onSubmit, taskToEdit, onUpdate }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'To Do',
  });

  useEffect(() => {
    if (taskToEdit) {
      setTaskData(taskToEdit);
    }
  }, [taskToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskToEdit) {
      onUpdate(taskData);
    } else {
      onSubmit(taskData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#1a1f3d] p-8 rounded-xl shadow-2xl border border-[#d2b68a]"
      >
        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#fdffff]">
            {taskToEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <p className="text-md text-[#eee5d9] mt-2">
            {taskToEdit ? "Update your task details below" : "Fill out the form to create a new task"}
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-[#eee5d9] mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
              required
              className="w-full px-4 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#ccc] focus:outline-none focus:border-[#d2b68a]"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-[#eee5d9] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              required
              className="w-full px-4 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#ccc] focus:outline-none focus:border-[#d2b68a] resize-none h-28"
            />
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-[#eee5d9] mb-1">
              Status
            </label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] focus:outline-none focus:border-[#d2b68a]"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-[#d2b68a] text-[#1a1f3d] font-semibold py-2 px-6 rounded-lg hover:bg-[#c1a675] transition"
            >
              {taskToEdit ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#444c70] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#5c648c] transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;
