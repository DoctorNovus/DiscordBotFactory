import { Magic } from '@magic-sdk/admin'
import { Database } from "../../lib/database";
import JSZip from "jszip";
import { resolve } from "path";
import { Blob } from 'blob-polyfill';
import saveAs from "save-as";

let protocol = "http";
let url = "localhost";
let port = 3000;
let zip = new JSZip();

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
            // const fs = require('fs');
            // // fs.writeFileSync("_extracted/file.zip", req.body);

            // var arraybuffer = req.body;
            // var blob = new Blob([arraybuffer], { type: "application/zip" });

            // console.log(blob);

            // global.window = window || global;


            // saveAs(blob, "_extracted/file.zip");
            // // console.log(req.body);

            // // fs.writeFileSync(resolve(`_extracted/file.zip`), req.body);

            // // try
            // // {
            // //     await extract(resolve(`_extracted/file.zip`), { dir: resolve(`_extracted/`) });
            // // } catch (err)
            // // {
            // //     console.log(err);
            // // }

            // // res.end()

            res.status(404).end();
        } else
        {
            res.status(404).end();
        }
    }
}