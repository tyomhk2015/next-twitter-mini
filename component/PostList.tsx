import Link from "next/link";
import React, { useState } from "react";

interface IAuthor {
  id: number;
  name: string;
}

interface IPost {
  id: number
  author: IAuthor
  description: string
  createdAt: Date
  authorId: number
  attachment?: string
}

interface IPostListProp {
  posts: IPost[]
}

const PostList: React.FC<IPostListProp> = ({posts}) => {
  const [loading, setLoading] = useState(false);

  console.log(posts);
  return (
    <ol>
      {posts.map((post) => {
        return (
        <li key={post.id} className={`first-of-type:mt-0 mt-2`}>
          {
            <Link href={`/tweet/${post.id}`}>
              <a className={`p-2 cursor-pointer`}>{post.author.name}: {post.description}</a>
            </Link>
          }
        </li>)
      })}
    </ol>
  );
};

export default PostList;
