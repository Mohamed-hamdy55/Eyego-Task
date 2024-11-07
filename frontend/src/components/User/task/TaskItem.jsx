import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useTranslate } from "../../../customHooks/translationHandler";
import { Link } from "react-router-dom";


function TaskItem({ task, onDelete, onUpdateState }) {
  const lang = useSelector((state) => state.language.lang);
  const trans = useTranslate();

  // State to track selected task State
  const [taskState, setTaskState] = useState(task.state);

  const stateOptions = [
    { value: "Not Started Yet", label: trans("Not Started Yet") },
    { value: "In Progress", label: trans("In Progress") },
    { value: "Completed", label: trans("Completed") },
  ];

  return (
    <div
      className={`w-full p-6 bg-white shadow-md rounded-md flex flex-col gap-4 
  ${
    task.state === "Not Started Yet"
      ? "border-x-8 border-gray-700"
      : task.state === "In Progress"
      ? "border-x-8 border-blue-700"
      : "border-x-8 border-green-700"
  }`}
    >
      {/* Task Title */}
      <h1 className="text-xl font-semibold ">
        {lang === "eng" ? task.title : task.ar_title}
      </h1>
      {/* Task Description */}
      <p className="text-gray-700 sm:pt-10 ">
        {lang === "eng" ? task.description : task.ar_description}
      </p>
      {/* State and Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full sm:w-auto">
        {/* State Dropdown */}
        <div className="425px:w-48 w-full">
          <Select
            options={stateOptions}
            value={stateOptions.find((option) => option.value === taskState)}
            onChange={(option) => {
              setTaskState(option.value);
              onUpdateState(task._id, option.value);
            }}
            className="w-full"
            placeholder={trans("Select state")}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(task._id)}
            className="flex items-center justify-center p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition transform hover:scale-105"
          >
            <FaTrash size={18} />
          </button>
          <Link to={`/update-task-info/${task._id}`} >
            <button className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition transform hover:scale-105">
              <FaEdit size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
