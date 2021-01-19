import Link from 'next/link'

export default function Template(props)
{
    return (
        <>
            <Link href={`/editor/${props.redirect}`}>
                <h2>{props.redirect}</h2>
            </Link>
        </>
    )
}