import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function logoutHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  await req.session.destroy();

  res.json({
    ok: true,
    message: `Logged out.`
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

export default withIronSessionApiRoute(logoutHandler, ironOptions);