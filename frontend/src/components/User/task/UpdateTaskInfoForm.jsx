import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../../server";
import { useTranslate } from "../../../customHooks/translationHandler";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UpdateTaskInfoForm({task_id}) {
  const trans = useTranslate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [ar_title, setArabicTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ar_description, setArabicDescription] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    if(isAuthenticated){
      const fetchTaskInfo = async ()=>{
        await axios.get(`${server}/task/get-task-info/${task_id}`,{withCredentials:true})
        .then((res)=>{
          const task = res.data.task;
          setTitle(task.title);
          setArabicTitle(task.ar_title);
          setDescription(task.description);
          setArabicDescription(task.ar_description);
        }).catch((err)=>{
          toast.error(err.response.data.message || "Error fetching task data");
        })
      };
      fetchTaskInfo();
    }
  },[isAuthenticated,task_id])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isAuthenticated){
    await axios.patch(`${server}/task/update-task/${task_id}`,{ title, ar_title, description, ar_description },{withCredentials:true})
      .then((res) => {
        toast.success(res.data.message || "Task updated successfully!");
        setTitle("");
        setArabicTitle("");
        setDescription("");
        setArabicDescription("");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    }else{
      toast.error("Login in first")
    }
  };

  return (
      <div className="mt-8  sm:max-w-2xl sm:mx-auto w-full bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              {trans("title")}
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="task"
                id="task"
                autoComplete="task"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="arabicTitle"
              className="text-sm font-medium text-gray-700"
            >
              {trans("Arabic Title")}
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="arabicTitle"
                id="arabicTitle"
                autoComplete="arabicTitle"
                required
                value={ar_title}
                onChange={(e) => {
                  setArabicTitle(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              {trans("Description")}
            </label>
            <div className="mt-1">
              <textarea
                name="description"
                id="description"
                autoComplete="description"
                required
                cols="30"
                rows="10"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              >
              </textarea>
            </div>
          </div>
          <div>
            <label
              htmlFor="arabicDescription"
              className="text-sm font-medium text-gray-700"
            >
              {trans("Arabic Description")}
            </label>
            <div className="mt-1">
              <textarea
                name="arabicDescription"
                id="arabicDescription"
                autoComplete="arabicDescription"
                required
                cols="30"
                rows="10"
                value={ar_description}
                onChange={(e) => {
                  setArabicDescription(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              >
              </textarea>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {trans("Save")}
            </button>
          </div>
        </form>
      </div>
  );
}

export default UpdateTaskInfoForm;
