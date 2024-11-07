import React from "react";
import { Link } from "react-router-dom";
import { useTranslate } from "../../customHooks/translationHandler";
import TasksList from "../../components/User/task/TasksList";
function HomePage() {
  const trans = useTranslate();
  return (
    <div className="flex flex-col gap-4">
      {/* Create New Task Button */}
      <section className="pt-24 px-10 w-full flex sm:justify-start justify-center">
        <Link to="/create-new-task">
          {/* Chanage language button */}
          <button
            className="text-white  p-2 border rounded-md bg-blue-600 hover:bg-blue-700 font-[500]"
            type="button"
          >
            {trans("Create New Task")}
          </button>
        </Link>
      </section>
      <section>
        <TasksList />
      </section>
    </div>
  );
}

export default HomePage;
