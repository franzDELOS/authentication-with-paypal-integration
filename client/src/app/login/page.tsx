"use client";
import { useRouter } from "next/navigation";
import { schema } from "@/app/shared/schemas/validationSchemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFormInput } from "../shared/utils/types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "../../../public/images/xtendly.webp";
import Image from "next/image";

const Login = () => {
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  axios.defaults.withCredentials = true;

  const onSubmit = async (data: IFormInput) => {
    console.log(data);

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const res = await axios.post(`${apiUrl}/login`, data);

      if (res.status === 200) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          src={image}
          alt="Logo"
          height={50}
          width={50}
          className="mx-auto"
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
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
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
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSubmit(onSubmit)}
            >
              Sign in
            </button>
          </div>
          <ToastContainer position={"bottom-center"} />
        </form>

        <p className="text-sm font-light text-black my-3">
          Doesn't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Signup here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
