import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";

interface ISignInForm {
  email: string;
  phone: string;
  password: string;
}

interface IMutateState {
  ok: boolean;
  error?: string;
  id?: number;
}

const Login: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accountError, setAccountError] = useState(false);
  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISignInForm>();

  const onValid: SubmitHandler<ISignInForm> = async (data) => {
    setLoading(true);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.ok && result.user) {
      setAccountError(false);
      mutate(
        "/api/loggedUser",
        (prev: IMutateState) => ({ ...prev, id: result.user.id }),
        true
      );
      router.push("/");
    }

    setAccountError(!!result.error);
    setLoading(false);
  };

  return (
    <div className={`p-2 sm:p-4`}>
      <h1 className={`font-bold text-white sm:text-lg`}>Login</h1>
      <form
        className={`mt-4 grid gap-2 rounded-lg border-[1px] border-gray-500 p-2 sm:p-4`}
        onSubmit={handleSubmit(onValid)}
      >
        {errors.email && (
          <p className={`font-bold text-red-500 text-center`}>
            Please write proper email address.
          </p>
        )}
        <input
          className={`mx-auto rounded-lg px-2 py-1 sm:w-1/2`}
          {...register("email", {
            required: "Email is required",
            validate: {
              isEmail: (currentValue) =>
                /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
                  currentValue
                )
            }
          })}
          type="email"
          placeholder="sample@sample.com"
        />
        {errors.password && (
          <p className={`font-bold text-red-500 text-center`}>
            Please write your password.
          </p>
        )}
        <input
          className={`mx-auto rounded-lg px-2 py-1 sm:w-1/2`}
          {...register("password", {
            required: "Password is required",
            validate: {
              isEmpty: (currentValue) => !!currentValue
            }
          })}
          type="password"
          placeholder="Password"
        />
        <button
          type="submit"
          className={`${
            loading ? `text-red-200` : `text-white`
          } mt-2 w-max place-self-center  rounded-2xl bg-sky-500 px-2 text-xs font-bold transition-all duration-200 hover:scale-110 sm:px-4 sm:py-1 sm:text-base`}
        >
          {loading ? "Loading" : "Login"}
        </button>
      </form>
      {accountError && (
        <div className={`mt-4`}>
          <p className={`font-bold text-red-500 text-center`}>
            Could not find your account.
          </p>
          <p className={`font-bold text-red-500 text-center`}>
            Please check your email and password.
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
