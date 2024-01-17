import { useState } from "react";
import condo from "../../assests/condo.png";
import { oktaAuth } from "../../oktaConfig";
import Toast, { showToast } from "../common/Toast";
import Button from "../common/Button";
import { useStore } from "@nanostores/react";
import { $userInfo } from "../../store/authStore";

const SignInForm = () => {
  const userInfo = useStore($userInfo);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      console.log("userInfo", JSON.parse(userInfo));
      $userInfo.set(
        JSON.stringify({
          username: formData.email,
          password: formData.password,
        })
      );

      setIsLoading(true);

      // const transaction = await oktaAuth.signInWithCredentials({
      //   username: formData.email,
      //   password: formData.password,
      // });

      // if (transaction.status === "SUCCESS") {
      //   await oktaAuth.token.getWithRedirect({
      //     responseType: ["id_token", "token"],
      //     sessionToken: transaction.sessionToken,
      //   });
      // } else {
      //   showToast("Login Failed, try again !", "error");
      // }
      setIsLoading(false);
    } catch (err) {
      console.error("Login Failed:", err);
      setIsLoading(false);
      showToast("Login Failed, try again !", "error");
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Toast />
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img src={condo.src} alt="condo" className="h-16 w-36 mb-7" />
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="current-password"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex ">
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </form>
              <div className="flex flex-col items-center justify-center">
                <Button
                  loading={isLoading}
                  onClick={handleSubmit}
                  // className=" text-white  border border-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </Button>
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignInForm;
