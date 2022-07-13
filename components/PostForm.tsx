import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useSWR from "swr";

interface IPostForm {
  description: string;
  attachment?: string;
}

interface IPostFormProp {
  authorId: number;
}

const PostForm: React.FC<IPostFormProp> = ({ authorId }) => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWR('/api/post');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPostForm>();

  const onValid: SubmitHandler<IPostForm> = async (data) => {
    if (loading) return;

    setLoading(true);
    const postData = { ...data, authorId };

    const response = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    const result = await response.json();

    if (result?.result) {
      setLoading(false);
      mutate();
    }
  };

  return (
    <form
      className={`relative grid border-b border-gray-500 px-2 py-3`}
      onSubmit={handleSubmit(onValid)}
    >
      <textarea
        className={`resize-y rounded-lg px-2 py-1 bg-black text-white border-[1px] border-gray-500`}
        {...register("description", {
          required: "description",
          validate: {
            isEmpty: (currentValue) => !!currentValue,
          },
        })}
        placeholder="Speak your mind!"
      />
      <button
        type="submit"
        className={`${
          loading ? `text-red-200` : `text-white`
        } mt-2 w-min place-self-end rounded-2xl bg-sky-500 px-2 text-xs font-bold transition-all duration-200 hover:scale-110 sm:px-4 sm:py-1 sm:text-base`}
      >
        {loading ? "Loading" : "Tweet"}
      </button>
      {errors.description && (
        <p
          className={`absolute left-2 top-[50%] mt-2 translate-y-[50%] place-self-end text-red-500`}
        >
          Please write something.
        </p>
      )}
    </form>
  );
};

export default PostForm;
