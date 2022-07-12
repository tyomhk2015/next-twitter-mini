import { NextApiRequest, NextApiResponse } from "next";
import client from "../lib/prisma";

export default async function signUpHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(401).end();
  }
  const { name, email, password, phone } = req.body;
  await client.user.create({
    data: {
      name,
      password,
      email,
      phone,
    }
  });

  res.json({
    ok: true,
    result: `${name}'s account has been added successfully.`
  });
}
