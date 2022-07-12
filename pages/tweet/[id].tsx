import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface IAuthor {
  id: number;
  name: string;
}

interface IPost {
  id: number;
  attachment?: string;
  author: IAuthor;
  authorId: number;
  createdAt: Date;
  description: string;
}

interface ILike {
  id: number,
  likedId: number,
  postId: number
}

const Tweet = () => {
  const router = useRouter();
  const id = router.query.id;
  const [post, setPost] = useState<IPost>();
  const { data, mutate } = useSWR("/api/loggedUser");

  const toggleLike = async () => {
    const likeExist = data?.likes?.find((like: ILike) => like.postId === Number(id) && like.likedId === data.id);
    await (await fetch('/api/like', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        likeId: likeExist ? likeExist.id : null,
        postId: post?.id,
        userId: data?.id
      }),
    })).json();
    mutate();
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/post?id=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPost(data.post);
      });
  }, [router]);

  return (
    <>
      {post && (
        <div>
          <h1>Tweet ID: {post.authorId}</h1>
          <p>{post.author.name}</p>
          <p>{post.description}</p>
          <button onClick={toggleLike}>
            Like
            <svg
              className="w-6 h-6"
              fill={data?.likes?.find((like: ILike) => like.postId === Number(id) && like.likedId === data.id) ? "#DD2222" : "none"}
              stroke={data?.likes?.find((like: ILike) => like.postId === Number(id) && like.likedId === data.id) ? "#DD2222" : "currentColor"}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Tweet;
