import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";

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
      body: JSON.stringify(data)
    }).then(() => {
      alert("Account has been created!\nLogin at Login page.");
      setLoading(false);
      router.push("/log-in");
    });
  };

  const onInvalid: SubmitErrorHandler<ISignUpForm> = (errors) => {
    console.log("error", errors);
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onValid, onInvalid)}>
        {errors.email && <p className={`text-red-500 font-bold`}>Please write proper email address.</p>}
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
        {errors.password && <p className={`text-red-500 font-bold`}>Please write your password.</p>}
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
        {errors.name && <p className={`text-red-500 font-bold`}>Please write your nickname.</p>}
        <input
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
          {...register("phone", {
            validate: {
              isNum: (currentValue) =>
                /[0-9]+/g.test(currentValue) || !currentValue,
            },
          })}
          type="number"
          placeholder="01012345678"
        />
        <button type="submit" className={loading ? `bg-slate-800 text-red-200 font-bold`: ''}>{loading ? 'Loading' : 'Create Account'}</button>
      </form>
      <Link href="/log-in">
        <a className={`p-2 grid max-w-[240px] bg-sky-200 rounded-lg text-center hover:text-white hover:bg-sky-500`}>
          <span>Already have an account?</span>
          <span className={`font-bold`}>Let's login!</span>
        </a>
      </Link>
    </div>
  );
};

export default SignUp;
