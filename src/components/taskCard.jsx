import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-4 mb-4 rounded shadow">
      <h3 className="font-bold">{task.title}</h3>
      <p className="text-sm">Assigned To: {task.assignedTo?.name || 'Unassigned'}</p>
    </div>
  );
};

export default TaskCard;
