import Link from "next/link";
import React from "react";

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
  return (
    <ol className={`text-white px-2 py-4`}>
      {posts.map((post) => {
        return (
        <li key={post.id} className={`first-of-type:mt-0 mt-2 rounded-lg border-gray-500 border-[1px] transition-all duration-200 hover:bg-[rgba(255,255,255,0.3)]`}>
          {
            <Link href={`/tweet/${post.id}`}>
              <a className={`cursor-pointer p-2 grid`}>{post.description}<span className={`place-self-end text-sm`}>Author: {post.author.name}</span></a>
            </Link>
          }
        </li>)
      })}
    </ol>
  );
};

export default PostList;
