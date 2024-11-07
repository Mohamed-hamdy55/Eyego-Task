import { useParams } from "react-router-dom";
import CreateNewPasswordForm from "../../components/User/ForgetPassword/CreateNewPasswordForm";

function CreateNewPasswordPage() {
  const { forget_password_token } = useParams();

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <CreateNewPasswordForm forget_password_token={forget_password_token} />
      </div>
    </div>
  );
}

export default CreateNewPasswordPage;
