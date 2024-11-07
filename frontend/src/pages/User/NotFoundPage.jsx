import React from "react";
import { Link } from "react-router-dom";
import { useTranslate } from "../../customHooks/translationHandler";

function NotFoundPage() {
  const trans = useTranslate();

  return (
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
            {trans("Something's missing")}
          </p>
          <p className="mb-10 text-lg font-light text-gray-900">
            {trans(
              "Sorry, we can't find that page. You'll find lots to explore on the home page"
            )}{" "}
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-[500] "
          >
            {trans("Back to Homepage")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
