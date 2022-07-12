import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import client from "../lib/prisma";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function loggedUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // When there is no user ID in iron-session,
  // return an error.
  if (!req.session.user) {
    res.json({
      ok: false,
      error: "User does not exist in the session."
    });
    // Make sure the code not to continue to prisma query.
    return;
  }

  const fetchedUser = await client.user.findUnique({
    where: {
      id: req.session.user?.id
    }
  });

  res.json({
    ok: true,
    ...fetchedUser
  });
}

const ironOptions = {
  cookieName: "nomad-carrot-final",
  password:
    "complex_password_at_least_32_characters_longcomplex_password_at_least_32_characters_long",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production"
  }
};

export default withIronSessionApiRoute(loggedUserHandler, ironOptions);