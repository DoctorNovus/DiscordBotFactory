import Iron from '@hapi/iron'

export default async (req, res) =>
{

    let token = JSON.parse(req.body).token;

    if (token)
    {
        let user = await Iron.unseal(token, process.env.ENCRYPTION_SECRET, Iron.defaults);

        if (user)
        {
            res.end(JSON.stringify(user));
        } else
        {
            res.status(404).end();
        }
    } else
    {
        res.status(405).end();
    }
}