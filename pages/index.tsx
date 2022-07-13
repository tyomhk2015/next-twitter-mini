import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

export default () => {
  const router = useRouter();
  const { data, mutate, error } = useSWR("/api/loggedUser");
  const { data: postData, mutate: postMutate } = useSWR("/api/post");

  const logout = async () => {
    await fetch('/api/logout');
    mutate();
  }

  mutate(); // Revalidate session.
  postMutate();

  useEffect(() => {
    const isLoading = !data && !error;
    // Prevent redirection when the page is at initial state.
    if (isLoading) return;

    if (data && !data.id) {
      router.push("/create-account");
    }
  }, [data, router, mutate, error]);

  return (
    <div className={`relative`}>
      <PostForm authorId={data?.id && data?.id} />
      {postData?.posts && <PostList posts={postData?.posts} />}
      {data?.id && (
        <button onClick={logout} className={`text-white text-bold bg-red-500 px-4 py-1 fixed rounded-2xl right-2 sm:right-5 bottom-3 sm:bottom-5`}>Logout</button>
      )}
    </div>
  );
};
