import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ISignInForm {
  email: string;
  phone: string;
  password: string;
}

const Login: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accountError, setAccountError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInForm>();

  const onValid: SubmitHandler<ISignInForm> = async (data) => {
    setLoading(true);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.ok && result.user) {
      setAccountError(false);
      router.push("/");
    }

    setAccountError(!!result.error);
    setLoading(false);
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onValid)}>
        {errors.email && (
          <p className={`text-red-500 font-bold`}>
            Please write proper email address.
          </p>
        )}
        <input
          {...register("email", {
            required: "Email is required",
            validate: {
              isEmail: (currentValue) =>
                /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
                  currentValue
                ),
            },
          })}
          type="email"
          placeholder="sample@sample.com"
        />
        {errors.password && (
          <p className={`text-red-500 font-bold`}>
            Please write your password.
          </p>
        )}
        <input
          {...register("password", {
            required: "Password is required",
            validate: {
              isEmpty: (currentValue) => !!currentValue,
            },
          })}
          type="password"
          placeholder="Password"
        />
        <button
          type="submit"
          className={loading ? `bg-slate-800 text-red-200 font-bold` : ""}
        >
          {loading ? "Loading" : "Login"}
        </button>
      </form>
      {accountError && (
        <>
          <p className={`text-red-500 font-bold`}>Could not find your account.</p>
          <p className={`text-red-500 font-bold`}>Please check your email and password.</p>
        </>
      )}
    </div>
  );
};

export default Login;
