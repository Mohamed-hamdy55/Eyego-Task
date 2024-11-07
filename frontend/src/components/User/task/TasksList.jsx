import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "../../../customHooks/Debounce";
import { useTranslate } from "../../../customHooks/translationHandler";
import { toast } from "react-toastify";
import LoadingRequest from "../../LoadingRequests/LoadingRequest";
import { server } from "../../../server";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import TaskItem from "./TaskItem";
import { useSelector } from "react-redux";
import TasksStateFilter from "./TasksStateFilter";

const TasksList = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10); // Number of items per page
  const [offset, setOffset] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [isLoading, setIsLoading] = useState(true); // loading checking
  const debouncedSearchTerm = useDebounce(searchQuery, 500); // Apply debouncing
  const trans = useTranslate();
  const [searchParams] = useSearchParams();

  // Options for the limit selector
  const limitOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 30, label: "30" },
    { value: 50, label: "50" },
    { value: 50, label: "60" },
    { value: 50, label: "70" },
    { value: 50, label: "80" },
    { value: 50, label: "90" },
    { value: 100, label: "100" },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${server}/task/get-tasks`,
            {
              params: {
                search: debouncedSearchTerm,
                offset: offset,
                limit: limit,
                state: searchParams.get("state") || null,
              },
              withCredentials: true,
            }
          );
          setTasks(response.data.tasks); // Use dynamic key for data
          setTotalPages(response.data.totalPages);
          setIsLoading(false);
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to fetch data");
        }
      }
    };

    fetchData();
  }, [debouncedSearchTerm, offset, limit, searchParams, user]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle pagination change
  const handleNextPage = () => {
    if (offset < totalPages) {
      setOffset(offset + 1);
    }
  };

  const handlePrevPage = () => {
    if (offset > 1) {
      setOffset(offset - 1);
    }
  };

  // Handle limit change
  const handleLimitChange = (selectedOption) => {
    setLimit(selectedOption.value);
    setOffset(1); // Reset to first page when limit changes
  };

  const onDelete = async (itemId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== itemId));
    try {
      const res = await axios.delete(`${server}/task/delete-task/${itemId}`, {
        withCredentials: true,
      });
      toast.success(res.data.message || "Task deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const onUpdateState = async (taskId, updatedState) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, state: updatedState } : task
      )
    );
    try {
      const res = await axios.patch(
        `${server}/task/update-task/${taskId}`,
        { state: updatedState },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Task state updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task state");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center pt-36 font-[500]">
        {trans("Log in to see your tasks")}
      </div>
    );
  }
  return (
    <div className="p-6 w-full">
      {isLoading ? (
        <LoadingRequest />
      ) : (
        <>
          <TasksStateFilter />
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              id="tableSearch"
              name="tableSearch"
              placeholder={trans("Search title, Arabic title")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          {tasks && tasks.length > 0 ? (
            <>
              <div className="my-4 flex items-center gap-2 ">
                <span>{trans("Items per Page")}</span>
                <Select
                  options={limitOptions}
                  value={limitOptions.find((option) => option.value === limit)}
                  onChange={handleLimitChange}
                  placeholder="Select items per page"
                />
              </div>

              {/* Tasks list */}
              <div className="flex flex-col w-full gap-4">
                {tasks &&
                  tasks.map((task) => <TaskItem task={task}  key={task._id} onDelete={onDelete} onUpdateState={onUpdateState}/>)}
              </div>

              {/* Pagination Controls */}
              <div className="flex mt-4 gap-2 items-center" >
                <button
                  onClick={handlePrevPage}
                  disabled={offset === 1}
                  className={`${
                    offset === 1 ? "cursor-not-allowed" : ""
                  } bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition `}
                >
                  {trans("Previous")}
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={offset === totalPages}
                  className={`${
                    offset === totalPages ? "cursor-not-allowed" : ""
                  } bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition `}
                >
                  {trans("Next")}
                </button>
                <span>
                  {trans("Page")} {offset} {trans("of")} {totalPages}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-center pt-36 font-[500]">
              {trans("No tasks found")}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TasksList;
