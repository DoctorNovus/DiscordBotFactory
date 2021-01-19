import { Database } from "../../lib/database";
import fs from "fs";

let protocol = "http";
let url = "localhost";
let port = 3000;

export default async (req, res) =>
{
    if (req.method !== "POST") return res.status(405).end();

    // exchange the did from Magic for some user data
    const api_token = req.headers.authorization.split('Bearer').pop().trim();
    let user = await fetch(`${protocol}://${url}:${port}/api/verify`, {
        method: "POST",
        body: JSON.stringify({
            token: api_token
        })
    });

    user = await user.json();

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

        if (use)
        {
            let template = fs.readFileSync(`${process.cwd()}/Templates/${req.body}.json`);
            template = Buffer.from(template).toString("utf-8");
            template = JSON.parse(template);

            let obj = {
                name: template.name,
                dirs: template.folders.map(f => ({ dirName: f.name, files: f.files.map(f => ({ fileName: f.file, text: f.data })) }))
            }

            res.end(JSON.stringify(obj));
        } else
        {
            res.status(404).end();
        }
    }
}