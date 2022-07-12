import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/db";

export default async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {

    // Get one post that matches the parameter, 'id' of the post.
    if (req.query.id) {
      const post = await client.post.findUnique({
        where: {
          id: +(req.query.id)
        },
        include: {
          author: true
        }
      });

      res.json({
        ok: true,
        post
      });

    } else {
      // Get all posts.
      const posts = await client.post.findMany({ orderBy: [
        {
          id: 'desc',
        },
      ],
      include: {
        author: true
      }
    });
  
      res.json({
        ok: true,
        posts
      });
    }
  }

  if (req.method === "POST") {
    const { authorId, description, attachment } = req.body;

    await client.post.create({
      data: {
        authorId: +authorId,
        description,
        attachment,
      }
    });

    res.json({
      ok: true,
      result: `A post has been added successfully.`
    });
  }
}
