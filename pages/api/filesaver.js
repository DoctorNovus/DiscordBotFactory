import { Database } from "../../lib/database";
import fs from "fs";
import { file } from "jszip";

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


            let fileSystem;

            try
            {
                fileSystem = JSON.parse(req.body);
            } catch (err)
            {
                console.log(err);
                res.status(405).end();
                return;
            }

            if (fileSystem)
            {
                let obj = {
                    name: "FactoryBot",
                    folders: []
                }

                Object.keys(fileSystem).map(key =>
                {
                    obj.folders.push({
                        name: key,
                        files: fileSystem[key].files.map(f => ({ name: f.fileName, text: f.text }))
                    });
                });

                res.end(JSON.stringify(obj));
            } else
            {
                res.status(405).end();
            }

            // template = Buffer.from(template).toString("utf-8");
            // template = JSON.parse(template);

            // let obj = {
            //     name: template.name,
            //     dirs: template.folders.map(f => ({ dirName: f.name, files: f.files.map(f => ({ fileName: f.file, text: f.data })) }))
            // }

            // res.end(JSON.stringify(obj));

            res.status(405).end();
        } else
        {
            res.status(404).end();
        }
    }
}