import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

export default () => {
  const router = useRouter();
  const { data, mutate ,error } = useSWR("/api/loggedUser");
  const { data: postData, mutate: postMutate } = useSWR("/api/post");

  mutate(); // Revalidate session.
  postMutate();

  useEffect(() => {
    const isLoading = !data && !error;

    // Prevent redirection when the page is at initial state.
    if (isLoading) return;

    if (data && data.error) {
      router.push("/create-account");
    }

  }, [data, router, mutate]);

  return (
    <>
      <PostForm authorId={data?.id && data?.id}/>
      {postData?.posts && (
        <PostList posts={postData?.posts}/>
      )}
  </>
  )
}