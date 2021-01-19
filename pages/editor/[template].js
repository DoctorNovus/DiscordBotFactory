import { useRouter } from 'next/router'
import CodeEditor from '../../Components/CodeEditor';
import useAuth from "../../hooks/useAuth";
import styles from "../../styles/Template.module.css";
import SelectionMenu from '../../Components/SelectionMenu';
import { ContextMenu, grabText, loadTemplate } from "../../utils/ClientFileSystem";
import Head from 'next/head';
import FolderMenu from '../../Components/FolderMenu';
import FileMenu from '../../Components/FileMenu';

export default function Post()
{
    const router = useRouter()
    const { template } = router.query;
    const { user } = useAuth();

    global.template = template;

    const globalStyle = `
        #__next {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-rows: 7.5% auto;
        }

        #__next > p {
            text-align: center;
        }

        #editorContainer{
            display: grid;
            grid-template-columns: 15% auto;
        }

        * { 
            margin: 0px;
        }

        textarea {
            resize: none;
        }

        #title {
            text-align: center;
            font-size: 2.25em;
            color: white;
            background-color: #3c3c3c;
        }
    `;

    let token;

    if (typeof document != "undefined")
    {
        document.addEventListener("click", (e) =>
        {
            if (e.target != (document.getElementById("folderMenu")))
                document.getElementById("folderMenu").setAttribute("disabled", true);

            if (e.target != (document.getElementById("fileMenu")))
                document.getElementById("fileMenu").setAttribute("disabled", true);
        });

        token = document.cookie.split("api_token=")[1].split(";")[0];

        fetch("/api/template", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: template
        })
            .then(result => result.json())
            .then((res) =>
            {
                loadTemplate(res);

            }).catch((err) =>
            {
                console.error(err)
            });

        if (user)
            return (
                <>
                    <Head>
                        <meta name="apple-mobile-web-app-capable" content="yes" />
                        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                        <link rel="manifest" href="/site.webmanifest" />
                        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                        <meta name="msapplication-TileColor" content="#00aba9" />
                        <meta name="theme-color" content="#ffffff" />
                    </Head>
                    <style>
                        {globalStyle}
                    </style>
                    <div className={styles.titleContainer} id="titleContainer">
                        <SelectionMenu></SelectionMenu>
                        <p id="title">Loading...</p>
                    </div>

                    <div id="editorContainer">
                        <div id="folders" onContextMenu={ContextMenu} className={styles.folders}>
                            <p>Test</p>
                        </div>
                        <CodeEditor></CodeEditor>
                        <FolderMenu></FolderMenu>
                        <FileMenu></FileMenu>
                    </div>
                </>
            );

        else
            return (
                <>
                    <h1>Templates</h1>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                              window.location.href = "/login"
                          ` }} />
                </>
            )
    }

    return (
        <>
            <h1>Templates</h1>
            <script dangerouslySetInnerHTML={{
                __html: `
                      window.location.href = "/login"
                  ` }} />
        </>
    )
}