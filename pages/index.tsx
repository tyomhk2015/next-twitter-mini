import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";

export default () => {
  const router = useRouter();
  const { data, mutate ,error } = useSWR("/api/loggedUser");

  console.log(data);

  useEffect(() => {
    // Prevent redirection when the page is at initial state.
    const isLoading = !data && !error;
    mutate();
    if (isLoading) return;
    console.log(data);
    if (data && data.error) {
      router.push("/create-account");
    }
  }, [data, router, mutate]);

  return (
    <div>
    <h1>Home</h1>
    {data?.id && Object.entries(data).map((element, index) => <p key={index}><>{element[0]}: {element[1]}</></p>)}

    <form></form>
  </div>
  )
}