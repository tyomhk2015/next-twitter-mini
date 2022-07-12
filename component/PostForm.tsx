import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IPostForm {
  description: string;
  attachment?: string;
}

interface IPostFormProp {
  authorId: number;
}

const PostForm: React.FC<IPostFormProp> = ({ authorId }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPostForm>();

  const onValid: SubmitHandler<IPostForm> = async (data) => {
    if(loading) return;

    setLoading(true);
    const postData = {...data, authorId};

    const response = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    const result = await response.json();

    if (result?.result) setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <h2>{authorId}</h2>
      {errors.description && (
        <p className={`text-red-500 font-bold`}>Please write something.</p>
      )}
      <textarea
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
        className={loading ? `bg-slate-800 text-red-200 font-bold` : ""}
      >
        {loading ? "Loading" : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
