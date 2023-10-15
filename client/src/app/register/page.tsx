"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { schema } from "@/app/shared/schemas/validationSchemas";
import { IFormInput } from "../shared/utils/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IFormInput) => {
    console.log(data);

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const res = await axios.post(`${apiUrl}/register`, data);

      if ("error" in res) {
        throw new Error("Failed to Register");
        toast.error("Error registering");
      } else {
        router.push("/login");
        toast.success("Registered successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-700 pt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-700 pt-1">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-700 pt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSubmit(onSubmit)}
            >
              Sign in
            </button>
          </div>
          <p className="text-sm font-light text-black">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Login here
            </a>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
