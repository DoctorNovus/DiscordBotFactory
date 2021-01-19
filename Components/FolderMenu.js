import { createFile, createFolder } from "../utils/ClientFileSystem";

export default function FolderMenu()
{
    return (
        <>
            <style>
                {
                    `
                        #folderMenu {
                            position: absolute;
                            background-color: #1e1e1e;
                            color: white;
                        }

                        #folderMenu[disabled] {
                            display: none;
                        }
                    `
                }
            </style>
            <div id="folderMenu" tabIndex="0" disabled>
                <ul>
                    <li onClick={createFolder}>New Folder</li>
                    <li onClick={createFile}>New File</li>
                    <li>Rename Folder</li>
                    <li>Delete Folder</li>
                </ul>
            </div>
        </>
    )
}