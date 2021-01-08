import useAuth from "../hooks/useAuth";

export default function Dashboard()
{
    const { user, loading } = useAuth();

    if (user)
        return (
            <>
                
            </>
        );
    else
        return (
            <>
                <h1>Dashboard</h1>
                <script dangerouslySetInnerHTML={{
                    __html: `
                        window.location.href = "/login"
                    ` }} />
            </>
        )
}