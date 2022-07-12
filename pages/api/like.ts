import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/db";

export default async function likeHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { likeId, postId, userId } = req.body;

    if (likeId) {
      // Disable 'like'
      await client.like.delete({
        where: {
          id: likeId
        },
      });
    } else {
      // Activate 'like'
      await client.like.create({
        data: {
          postId,
          likedId: userId,
        },
      });
    }
  }

  res.json({
    ok: true,
  });
}
