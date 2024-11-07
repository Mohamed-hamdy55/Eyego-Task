import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslate } from "../../../customHooks/translationHandler";

function TasksStateFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const trans = useTranslate();
  const current_State = searchParams.get("state");
  const activeState = "Not-Started-Yet" === current_State ? 1 : "In-Progress" === current_State ? 2 : "Completed" === current_State ? 3 : 0 ;
  


  const handleStateSelected = (num, value) => {
    if (activeState === num) {
      searchParams.delete("state");
    } else {
      searchParams.set("state", value);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full flex sm:flex-row flex-col justify-evenly gap-y-2 my-10 p-5 text-center">
      <h5
        className={`cursor-pointer text-sm font-[500] bg-white p-2 rounded-lg sm:w-[200px] w-full ${activeState === 1 ? "text-[#3321c8]" : ""}`}
        onClick={() => handleStateSelected(1, "Not-Started-Yet")}
      >
        {trans("Not Started Yet")}
      </h5>
      <h5
        className={`cursor-pointer text-sm font-[500] bg-white p-2 rounded-lg sm:w-[200px] w-full ${activeState === 2 ? "text-[#3321c8]" : ""}`}
        onClick={() => handleStateSelected(2, "In-Progress")}
      >
        {trans("In Progress")}
      </h5>
      <h5
        className={`cursor-pointer text-sm font-[500] bg-white p-2 rounded-lg sm:w-[200px] w-full ${activeState === 3 ? "text-[#3321c8]" : ""}`}
        onClick={() => handleStateSelected(3, "Completed")}
      >
        {trans("Completed")}
      </h5>
    </div>
  );
}

export default TasksStateFilter;
