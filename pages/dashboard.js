import useAuth from "../hooks/useAuth";
import TemplateSelector from "../Components/TemplateSelector";

import "../styles/Dashboard.module.css";
import Head from "next/head";

export default function Dashboard()
{
    const { user, loading } = useAuth();

    if (user)
        return (
            <>
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                    <meta name="msapplication-TileColor" content="#00aba9" />
                    <meta name="theme-color" content="#ffffff" />
                </Head>
                <TemplateSelector />
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