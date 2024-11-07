import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useTranslate } from "../../customHooks/translationHandler";
import { useSelector } from "react-redux";

/**
 * Register Functional Component that contains a form with Fullname, email, password, avatar:
 *  - user enter his data depends on the validation restrictions"
 *  - when user submit his data, a request sended to the server by 'axios' to handle teh creation logic db
 *  - if the user email is already exist, the server will return status:400 and will show exist message
 *  - if the user already has an account, he will press login
 *
 * @returns HTML component
 */
function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const lang = useSelector((state) => state.language.lang);
  const trans = useTranslate();


  const handleFileInputChange = (e) => {
    const file = e.target.files[0]; // Get the actual file object
    setAvatar(file); // Store the file object for form submission

    const reader = new FileReader();

    try {
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result); // Set the Base64 string for preview
        }
      };
      reader.readAsDataURL(file); // Convert file to Base64 string for preview
    } catch (error) {
      setAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const newForm = new FormData();

    newForm.append("file", avatar);
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);

    axios
      .post(`${server}/user/create-user`, newForm, config)
      .then((res) => {
        toast.success(res.data.message || "Go and check your mail");
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message || "registration failed");
      });
  };

  return (
    <div className=" flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {trans("Register 😄")}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              {trans("Name")}
            </label>
            <div className="mt-1">
              <input
                type="name"
                name="name"
                id="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {trans("Email")}
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {trans("Password")}
            </label>
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              />
              {visible ? (
                <AiOutlineEye
                  className={`absolute ${
                    lang === "ar" ? "left-2" : "right-2"
                  } top-2 cursor-pointer `}
                  size={25}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className={`absolute ${
                    lang === "ar" ? "left-2" : "right-2"
                  } top-2 cursor-pointer `}
                  size={25}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          </div>
          <div>
            <div className="black mt-2 flex ">
              <label
                htmlFor="avatar"
                className="inline-block h-10 w-10 rounded-full overflow-hidden hover:cursor-pointer"
              >
                {avatar ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <RxAvatar className="h-10 w-10" />
                )}
              </label>
              <label
                htmlFor="avatar"
                className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 hover:cursor-pointer"
              >
                <span>{trans("Upload an image")}</span>
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="sr-only"
                  hidden={true}
                />
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {trans("Submit")}
            </button>
          </div>
          <div className="flex items-center w-full">
            <h4>{trans("Not have any accout")}&nbsp;</h4>
            <Link to="/login" className="text-blue-600 pl-2 hover:underline">
              {trans("Login")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
