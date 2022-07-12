import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/db";

interface ILoginForm {
  email: string;
  password: string;
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return;
  const {email, password}: ILoginForm = req.body;

  const fetchedUser = await client.user.findFirst({ where: { email, password}});

  // When there is no account with given email and password,
  // return an error as response
  if (!fetchedUser) {
    res.json({
      ok: false,
      error: "No account exist"
    });

    // Make sure the code continue to iron-session logic.
    return;
  }

  // When there is an account with given email and password,
  // save the ID number of the account in iron-session.
  req.session.user = {
    id: +fetchedUser.id
  };

  await req.session.save();

  res.json({
    ok: true,
    user: fetchedUser
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

export default withIronSessionApiRoute(loginHandler, ironOptions);
