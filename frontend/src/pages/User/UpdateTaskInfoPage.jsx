import React from "react";
import { useTranslate } from "../../customHooks/translationHandler";
import UpdateTaskInfoForm from "../../components/User/task/UpdateTaskInfoForm";
import { useParams } from "react-router-dom";

function UpdateTaskInfoPage() {
  const trans = useTranslate();
  const { task_id } = useParams();

  return (
    <div className="flex flex-col justify-center py-20 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {trans("Update Task Information")}
        </h2>
      </div>
      <UpdateTaskInfoForm task_id={task_id} />
    </div>
  );
}

export default UpdateTaskInfoPage;
