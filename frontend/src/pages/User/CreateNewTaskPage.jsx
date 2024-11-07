import React from "react";
import { useTranslate } from "../../customHooks/translationHandler";
import CreateNewTaskForm from "../../components/User/task/CreateNewTaskForm"

function CreateNewTaskPage() {
  const trans = useTranslate();
  return (
    <div className="flex flex-col justify-center py-20 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {trans("Create New Task")}
        </h2>
      </div>
      <CreateNewTaskForm />
    </div>
  );
}

export default CreateNewTaskPage;
