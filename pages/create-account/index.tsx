import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ISignUpForm {
  email: string;
  phone: string;
  password: string;
  name: string;
}

const SignUp: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>();

  const onValid: SubmitHandler<ISignUpForm> = (data) => {
    setLoading(true);

    fetch("/api/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(() => {
      alert("Account has been created!\nLogin at Login page.");
      setLoading(false);
      router.push("/log-in");
    });
  };

  return (
    <div className={`p-2 sm:p-4`}>
      <h1 className={`font-bold text-white sm:text-lg`}>Sign Up</h1>
      <form className={`mt-4`} onSubmit={handleSubmit(onValid)}>
        <div
          className={`grid gap-2 rounded-lg border-[1px] border-gray-500 p-2 sm:p-4`}
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
                  ),
              },
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
                isEmpty: (currentValue) => !!currentValue,
              },
            })}
            type="password"
            placeholder="Password"
          />
          {errors.name && (
            <p className={`font-bold text-red-500 text-center`}>
              Please write your nickname.
            </p>
          )}
          <input
            className={`mx-auto rounded-lg px-2 py-1 sm:w-1/2`}
            {...register("name", {
              required: "Nickname is required",
              validate: {
                isEmpty: (currentValue) => !!currentValue,
              },
            })}
            type="text"
            placeholder="Nickname"
          />
          <input
            className={`mx-auto rounded-lg px-2 py-1 sm:w-1/2`}
            {...register("phone", {
              validate: {
                isNum: (currentValue) =>
                  /[0-9]+/g.test(currentValue) || !currentValue,
              },
            })}
            type="number"
            placeholder="01012345678 (Optional)"
          />
          <button
            type="submit"
            className={`${
              loading ? `text-red-200` : `text-white`
            } mt-2 w-max place-self-center  rounded-2xl bg-sky-500 px-2 text-xs font-bold transition-all duration-200 hover:scale-110 sm:px-4 sm:py-1 sm:text-base`}
          >
            {loading ? "Loading" : "Create Account"}
          </button>
        </div>
      </form>
      <div className={`flex justify-end`}>
        <Link href="/log-in">
          <a
            className={`mt-4 inline-block origin-top-right p-2 text-right text-white transition-all duration-200 hover:scale-110`}
          >
            <span>Already have an account?</span>
            <br />
            <span className={`font-bold`}>Let's login!</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
