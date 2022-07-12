import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";
import PostForm from "../component/PostForm";
import PostList from "../component/PostList";

export default () => {
  const router = useRouter();
  const { data, mutate ,error } = useSWR("/api/loggedUser");
  const { data: postData, mutate: postMutate } = useSWR("/api/post");

  useEffect(() => {
    const isLoading = !data && !error;
    mutate(); // Revalidate session.

    // Prevent redirection when the page is at initial state.
    if (isLoading) return;

    if (data && data.error) {
      router.push("/create-account");
    }

    postMutate();
  }, [data, router, mutate]);

  return (
    <div>
    <h1>Home</h1>
    <PostForm authorId={data?.id && data?.id}/>
    {postData?.posts && (
      <PostList posts={postData?.posts}/>
    )}
  </div>
  )
}