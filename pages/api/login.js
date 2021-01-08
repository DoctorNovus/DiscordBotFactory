import { Magic } from '@magic-sdk/admin'
import Iron from '@hapi/iron'
import CookieService from '../../lib/cookie'
import { Database } from "../../lib/database";

export default async (req, res) =>
{
  if (req.method !== 'POST') return res.status(405).end()

  // exchange the did from Magic for some user data
  const did = req.headers.authorization.split('Bearer').pop().trim()
  const user = await new Magic(process.env.MAGIC_SECRET_KEY).users.getMetadataByToken(did)

  let dbf = await Database.access(process.env.MONGO_URL, "DBF");
  let verified;

  try
  {
    verified = await Database.createCollection(dbf, "verified");
  } catch {
    verified = await Database.getCollection(dbf, "verified");
  }

  if (verified)
  {
    let use = await Database.search(verified, { email: user.email });

    if(use)
    {
      // Author a couple of cookies to persist a user's session
      const token = await Iron.seal(user, process.env.ENCRYPTION_SECRET, Iron.defaults)
      CookieService.setTokenCookie(res, token)

      res.end()
    } else {
      res.status(404).end();
    }
  }
}