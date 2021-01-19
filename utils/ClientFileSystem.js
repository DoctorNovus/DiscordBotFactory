import JSZip, { folder } from "jszip";
import { saveAs } from 'file-saver';

let globalText = "";

export async function grabText()
{
    let formatter = document.getElementById("formatter");
    let oldText = formatter.innerHTML;
    formatter.innerHTML = formatter.innerHTML.split(/<br>/g).join("\\n");
    let text = formatter.textContent;
    formatter.innerHTML = oldText;

    return text;
}

export async function switchCode(dirName, fileName, codeDisplay)
{
    let tT = document.getElementById("title");
    let title = tT.innerText;
    let text = await grabText();

    if (title)
        if (title.includes("/"))
            await saveCode(title, text);


    tT.innerText = `${dirName}/${fileName}`;

    if (typeof window != "undefined")
    {
        let file = fileSystem[dirName].files.find(f => f.fileName == fileName);
        if (file)
            await syntaxHighlight("javascript", file.text, document.getElementById(codeDisplay));
    }
}

export async function syntaxHighlight(language, text, formatter)
{
    switch (language)
    {
        case "javascript":
            try
            {
                if (typeof text == "object")
                    text = JSON.stringify(text);
            } catch {

            }

            text = text.split(/\\n/g).join("<br>");

            formatter.innerHTML = text;
            break;
    }
}

export function ColourCode(elmnt, mode)
{
    var lang = (mode || "html");
    var elmntObj = (document.getElementById(elmnt) || elmnt);
    var elmntTxt = elmntObj.innerHTML;
    elmntObj.spellcheck = false;
    elmntObj.focus();
    elmntObj.blur();

    elmntObj.onkeydown = async (e) =>
    {
        if (e.key == "Tab")
        {
            e.preventDefault();

            var doc = elmntObj.ownerDocument.defaultView;
            var sel = doc.getSelection();
            var range = sel.getRangeAt(0);

            var tabNode = document.createTextNode("\u00a0\u00a0");
            range.insertNode(tabNode);

            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (e.key == "Enter")
        {
            e.preventDefault();

            var doc = elmntObj.ownerDocument.defaultView;
            var sel = doc.getSelection();
            var range = sel.getRangeAt(0);

            var tabNode = document.createTextNode("\n");
            range.insertNode(tabNode);

            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    var tagcolor = "skyblue";
    var tagnamecolor = "gold";
    var attributecolor = "red";
    var attributevaluecolor = "skyblue";
    var commentcolor = "green";
    var cssselectorcolor = "gold";
    var csspropertycolor = "red";
    var csspropertyvaluecolor = "skyblue";
    var cssdelimitercolor = "white";
    var cssimportantcolor = "red";
    var jscolor = "white";
    var jskeywordcolor = "skyblue";
    var jsstringcolor = "gold";
    var jsnumbercolor = "red";
    var jspropertycolor = "white";
    elmntObj.style.fontFamily = "Consolas,'Courier New', monospace";
    if (!lang) { lang = "html"; }
    if (lang == "html") { elmntTxt = htmlMode(elmntTxt); }
    if (lang == "css") { elmntTxt = cssMode(elmntTxt); }
    if (lang == "js") { elmntTxt = jsMode(elmntTxt); }
    elmntObj.innerHTML = elmntTxt;

    function extract(str, start, end, func, repl)
    {
        var s, e, d = "", a = [];
        while (str.search(start) > -1)
        {
            s = str.search(start);
            e = str.indexOf(end, s);
            if (e == -1) { e = str.length; }
            if (repl)
            {
                a.push(func(str.substring(s, e + (end.length))));
                str = str.substring(0, s) + repl + str.substr(e + (end.length));
            } else
            {
                d += str.substring(0, s);
                d += func(str.substring(s, e + (end.length)));
                str = str.substr(e + (end.length));
            }
        }
        this.rest = d + str;
        this.arr = a;
    }

    function htmlMode(txt)
    {
        var rest = txt, done = "", php, comment, angular, startpos, endpos, note, i;
        comment = new extract(rest, "&lt;!--", "--&gt;", commentMode, "W3HTMLCOMMENTPOS");
        rest = comment.rest;
        while (rest.indexOf("&lt;") > -1)
        {
            note = "";
            startpos = rest.indexOf("&lt;");
            if (rest.substr(startpos, 9).toUpperCase() == "&LT;STYLE") { note = "css"; }
            if (rest.substr(startpos, 10).toUpperCase() == "&LT;SCRIPT") { note = "javascript"; }
            endpos = rest.indexOf("&gt;", startpos);
            if (endpos == -1) { endpos = rest.length; }
            done += rest.substring(0, startpos);
            done += tagMode(rest.substring(startpos, endpos + 4));
            rest = rest.substr(endpos + 4);
            if (note == "css")
            {
                endpos = rest.indexOf("&lt;/style&gt;");
                if (endpos > -1)
                {
                    done += cssMode(rest.substring(0, endpos));
                    rest = rest.substr(endpos);
                }
            }
            if (note == "javascript")
            {
                endpos = rest.indexOf("&lt;/script&gt;");
                if (endpos > -1)
                {
                    done += jsMode(rest.substring(0, endpos));
                    rest = rest.substr(endpos);
                }
            }
        }
        rest = done + rest;
        for (i = 0; i < comment.arr.length; i++)
        {
            rest = rest.replace("W3HTMLCOMMENTPOS", comment.arr[i]);
        }
        return rest;
    }

    function tagMode(txt)
    {
        var rest = txt, done = "", startpos, endpos, result;
        while (rest.search(/(\s|<br>)/) > -1)
        {
            startpos = rest.search(/(\s|<br>)/);
            endpos = rest.indexOf("&gt;");
            if (endpos == -1) { endpos = rest.length; }
            done += rest.substring(0, startpos);
            done += attributeMode(rest.substring(startpos, endpos));
            rest = rest.substr(endpos);
        }
        result = done + rest;
        result = "<span style=color:" + tagcolor + ">&lt;</span>" + result.substring(4);
        if (result.substr(result.length - 4, 4) == "&gt;")
        {
            result = result.substring(0, result.length - 4) + "<span style=color:" + tagcolor + ">&gt;</span>";
        }
        return "<span style=color:" + tagnamecolor + ">" + result + "</span>";
    }

    function attributeMode(txt)
    {
        var rest = txt, done = "", startpos, endpos, singlefnuttpos, doublefnuttpos, spacepos;
        while (rest.indexOf("=") > -1)
        {
            endpos = -1;
            startpos = rest.indexOf("=");
            singlefnuttpos = rest.indexOf("'", startpos);
            doublefnuttpos = rest.indexOf('"', startpos);
            spacepos = rest.indexOf(" ", startpos + 2);
            if (spacepos > -1 && (spacepos < singlefnuttpos || singlefnuttpos == -1) && (spacepos < doublefnuttpos || doublefnuttpos == -1))
            {
                endpos = rest.indexOf(" ", startpos);
            } else if (doublefnuttpos > -1 && (doublefnuttpos < singlefnuttpos || singlefnuttpos == -1) && (doublefnuttpos < spacepos || spacepos == -1))
            {
                endpos = rest.indexOf('"', rest.indexOf('"', startpos) + 1);
            } else if (singlefnuttpos > -1 && (singlefnuttpos < doublefnuttpos || doublefnuttpos == -1) && (singlefnuttpos < spacepos || spacepos == -1))
            {
                endpos = rest.indexOf("'", rest.indexOf("'", startpos) + 1);
            }
            if (!endpos || endpos == -1 || endpos < startpos) { endpos = rest.length; }
            done += rest.substring(0, startpos);
            done += attributeValueMode(rest.substring(startpos, endpos + 1));
            rest = rest.substr(endpos + 1);
        }
        return "<span style=color:" + attributecolor + ">" + done + rest + "</span>";
    }

    function attributeValueMode(txt)
    {
        return "<span style=color:" + attributevaluecolor + ">" + txt + "</span>";
    }

    function commentMode(txt)
    {
        return "<span style=color:" + commentcolor + ">" + txt + "</span>";
    }

    function cssMode(txt)
    {
        var rest = txt, done = "", s, e, comment, i, midz, c, cc;
        comment = new extract(rest, /\/\*/, "*/", commentMode, "W3CSSCOMMENTPOS");
        rest = comment.rest;
        while (rest.search("{") > -1)
        {
            s = rest.search("{");
            midz = rest.substr(s + 1);
            cc = 1;
            c = 0;
            for (i = 0; i < midz.length; i++)
            {
                if (midz.substr(i, 1) == "{") { cc++; c++ }
                if (midz.substr(i, 1) == "}") { cc--; }
                if (cc == 0) { break; }
            }
            if (cc != 0) { c = 0; }
            e = s;
            for (i = 0; i <= c; i++)
            {
                e = rest.indexOf("}", e + 1);
            }
            if (e == -1) { e = rest.length; }
            done += rest.substring(0, s + 1);
            done += cssPropertyMode(rest.substring(s + 1, e));
            rest = rest.substr(e);
        }
        rest = done + rest;
        rest = rest.replace(/{/g, "<span style=color:" + cssdelimitercolor + ">{</span>");
        rest = rest.replace(/}/g, "<span style=color:" + cssdelimitercolor + ">}</span>");
        for (i = 0; i < comment.arr.length; i++)
        {
            rest = rest.replace("W3CSSCOMMENTPOS", comment.arr[i]);
        }
        return "<span style=color:" + cssselectorcolor + ">" + rest + "</span>";
    }

    function cssPropertyMode(txt)
    {
        var rest = txt, done = "", s, e, n, loop;
        if (rest.indexOf("{") > -1) { return cssMode(rest); }
        while (rest.search(":") > -1)
        {
            s = rest.search(":");
            loop = true;
            n = s;
            while (loop == true)
            {
                loop = false;
                e = rest.indexOf(";", n);
                if (rest.substring(e - 5, e + 1) == "&nbsp;")
                {
                    loop = true;
                    n = e + 1;
                }
            }
            if (e == -1) { e = rest.length; }
            done += rest.substring(0, s);
            done += cssPropertyValueMode(rest.substring(s, e + 1));
            rest = rest.substr(e + 1);
        }
        return "<span style=color:" + csspropertycolor + ">" + done + rest + "</span>";
    }

    function cssPropertyValueMode(txt)
    {
        var rest = txt, done = "", s;
        rest = "<span style=color:" + cssdelimitercolor + ">:</span>" + rest.substring(1);
        while (rest.search(/!important/i) > -1)
        {
            s = rest.search(/!important/i);
            done += rest.substring(0, s);
            done += cssImportantMode(rest.substring(s, s + 10));
            rest = rest.substr(s + 10);
        }
        result = done + rest;
        if (result.substr(result.length - 1, 1) == ";" && result.substr(result.length - 6, 6) != "&nbsp;" && result.substr(result.length - 4, 4) != "&lt;" && result.substr(result.length - 4, 4) != "&gt;" && result.substr(result.length - 5, 5) != "&amp;")
        {
            result = result.substring(0, result.length - 1) + "<span style=color:" + cssdelimitercolor + ">;</span>";
        }

        return "<span style=color:" + csspropertyvaluecolor + ">" + result + "</span>";
    }

    function cssImportantMode(txt)
    {
        return "<span style=color:" + cssimportantcolor + ";font-weight:bold;>" + txt + "</span>";
    }

    function jsMode(txt)
    {
        var rest = txt, done = "", esc = [], i, cc, tt = "", sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, numpos, mypos, dotpos, y;
        for (i = 0; i < rest.length; i++)
        {
            cc = rest.substr(i, 1);
            if (cc == "\\")
            {
                esc.push(rest.substr(i, 2));
                cc = "W3JSESCAPE";
                i++;
            }
            tt += cc;
        }
        rest = tt;
        y = 1;
        while (y == 1)
        {
            sfnuttpos = getPos(rest, "'", "'", jsStringMode);
            dfnuttpos = getPos(rest, '"', '"', jsStringMode);
            compos = getPos(rest, /\/\*/, "*/", commentMode);
            comlinepos = getPos(rest, /\/\//, "<br>", commentMode);
            numpos = getNumPos(rest, jsNumberMode);
            keywordpos = getKeywordPos("js", rest, jsKeywordMode);
            dotpos = getDotPos(rest, jsPropertyMode);
            if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comlinepos[0], keywordpos[0], dotpos[0]) == -1) { break; }
            mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, dotpos);
            if (mypos[0] == -1) { break; }
            if (mypos[0] > -1)
            {
                done += rest.substring(0, mypos[0]);
                done += mypos[2](rest.substring(mypos[0], mypos[1]));
                rest = rest.substr(mypos[1]);
            }
        }
        rest = done + rest;
        for (i = 0; i < esc.length; i++)
        {
            rest = rest.replace("W3JSESCAPE", esc[i]);
        }
        return "<span style=color:" + jscolor + ">" + rest + "</span>";
    }

    function jsStringMode(txt)
    {
        return "<span style=color:" + jsstringcolor + ">" + txt + "</span>";
    }

    function jsKeywordMode(txt)
    {
        return "<span style=color:" + jskeywordcolor + ">" + txt + "</span>";
    }

    function jsNumberMode(txt)
    {
        return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";
    }

    function jsPropertyMode(txt)
    {
        return "<span style=color:" + jspropertycolor + ">" + txt + "</span>";
    }

    function getDotPos(txt, func)
    {
        var x, i, j, s, e, arr = [".", "<", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/", "-", "*", "|", "%"], cc;
        s = txt.indexOf(".");
        if (s > -1)
        {
            x = txt.substr(s + 1);
            for (j = 0; j < x.length; j++)
            {
                cc = x[j];
                for (i = 0; i < arr.length; i++)
                {
                    if (cc.indexOf(arr[i]) > -1)
                    {
                        e = j;
                        return [s + 1, e + s + 1, func];
                    }
                }
            }
        }
        return [-1, -1, func];
    }

    function getMinPos()
    {
        var i, arr = [];
        for (i = 0; i < arguments.length; i++)
        {
            if (arguments[i][0] > -1)
            {
                if (arr.length == 0 || arguments[i][0] < arr[0]) { arr = arguments[i]; }
            }
        }
        if (arr.length == 0) { arr = arguments[i]; }
        return arr;
    }

    function getKeywordPos(typ, txt, func)
    {
        var words, i, pos, rpos = -1, rpos2 = -1, patt;
        if (typ == "js")
        {
            words = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete",
                "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import",
                "in", "instanceof", "int", "interface", "let", "long", "NaN", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static",
                "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];
        }
        for (i = 0; i < words.length; i++)
        {
            pos = txt.indexOf(words[i]);
            if (pos > -1)
            {
                patt = /\W/g;
                if (txt.substr(pos + words[i].length, 1).match(patt) && txt.substr(pos - 1, 1).match(patt))
                {
                    if (pos > -1 && (rpos == -1 || pos < rpos))
                    {
                        rpos = pos;
                        rpos2 = rpos + words[i].length;
                    }
                }
            }
        }
        return [rpos, rpos2, func];
    }

    function getPos(txt, start, end, func)
    {
        var s, e;
        s = txt.search(start);
        e = txt.indexOf(end, s + (end.length));
        if (e == -1) { e = txt.length; }
        return [s, e + (end.length), func];
    }

    function getNumPos(txt, func)
    {
        var arr = ["<br>", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/", "-", "*", "|", "%", "="], i, j, c, startpos = 0, endpos, word;
        for (i = 0; i < txt.length; i++)
        {
            for (j = 0; j < arr.length; j++)
            {
                c = txt.substr(i, arr[j].length);
                if (c == arr[j])
                {
                    if (c == "-" && (txt.substr(i - 1, 1) == "e" || txt.substr(i - 1, 1) == "E"))
                    {
                        continue;
                    }
                    endpos = i;
                    if (startpos < endpos)
                    {
                        word = txt.substring(startpos, endpos);
                        if (!isNaN(word)) { return [startpos, endpos, func]; }
                    }
                    i += arr[j].length;
                    startpos = i;
                    i -= 1;
                    break;
                }
            }
        }
        return [-1, -1, func];
    }
}

export function loadTemplate(res, alreadyConfig = false)
{
    if (!alreadyConfig)
    {
        document.querySelector("#title").innerText = res.name;
        document.querySelector("#folders").innerHTML = "";

        global.fileSystem = {};
        res.dirs.forEach(dir =>
        {
            global.fileSystem[dir.dirName] = dir;

            let div = document.createElement("div");
            let dirName = document.createElement("p");
            dirName.innerText = dir.dirName;
            let files = document.createElement("ul");
            files.classList = "files";

            div.oncontextmenu = (e) =>
            {
                e.preventDefault();
            }

            dir.files.forEach(f =>
            {
                let fileName = document.createElement("li");
                fileName.innerText = f.fileName;
                fileName.onclick = async (e) =>
                {
                    let file = e.target.innerText;

                    await switchCode(dir.dirName, file, "formatter");
                    await ColourCode("formatter", "js")
                }

                files.appendChild(fileName);
            });

            div.appendChild(dirName);
            div.appendChild(files);

            document.querySelector("#folders").appendChild(div);
        });
    } else
    {
        let fold = Object.keys(res);

        document.querySelector("#title").innerText = fold[0];
        document.querySelector("#folders").innerHTML = "";

        for (let folder of fold)
        {
            let div = document.createElement("div");
            let dirName = document.createElement("p");
            dirName.innerText = folder;
            let files = document.createElement("ul");
            files.classList = "files";

            div.oncontextmenu = (e) =>
            {
                e.preventDefault();
            }

            fileSystem[folder].files.forEach(f =>
            {
                let structure = handleHandler(folderHandler(f), files);

                // let fileName = document.createElement("li");
                // fileName.innerText = f.fileName;
                // fileName.onclick = async (e) =>
                // {
                //     let file = e.target.innerText;

                //     await switchCode(folder, file, "formatter");
                //     await ColourCode("formatter", "js")
                // }

                // files.appendChild(fileName);
            });

            div.appendChild(dirName);
            div.appendChild(files);

            document.querySelector("#folders").appendChild(div);
        };
    }
}

function handleHandler(folderHandlerResult, files)
{
    if (folderHandlerResult.dirName)
    {
        let div = document.createElement("div");
        let dirName = document.createElement("p");
        dirName.innerText = folderHandlerResult.dirName;
        let newFiles = document.createElement("ul");
        newFiles.classList = "files";

        folderHandlerResult.files.forEach(f => handleHandler(f, newFiles));

        div.appendChild(dirName);
        div.appendChild(newFiles);

        files.appendChild(div);
    } else
    {
        let fileName = document.createElement("li");
        fileName.innerText = folderHandlerResult.fileName;
        fileName.onclick = async (e) =>
        {
            let file = e.target.innerText;

            await switchCode(folder, file, "formatter");
            await ColourCode("formatter", "js")
        }

        files.appendChild(fileName);
    }
}

function folderHandler(dir)
{
    if (dir.files)
    {
        let files = dir.files.map((f) =>
        {
            if (f.files)
            {
                return folderHandler(f);
            } else
            {
                return {
                    fileName: f.fileName,
                    text: f.text
                }
            }
        });

        return {
            dirName: dir.dirName,
            files
        }
    } else
    {
        return dir;
    }
}

export async function saveCode(title, text)
{
    let [dir, file] = title.split("/");
    global.fileSystem[dir].files.find(f => f.fileName == file).text = text;
}

export async function importCode()
{
    let imp = document.getElementById("import-file");
    let fr = new FileReader();

    let fileConfig = {
        name: "SimpleBot",
        dirs: []
    };

    fr.onload = () =>
    {
        try
        {
            let obj = JSON.parse(fr.result);
            Object.keys(obj).forEach(key =>
            {
                fileConfig.dirs.push({
                    dirName: key,
                    files: obj[key].files
                });
            });

            loadTemplate(fileConfig);
        } catch (err)
        {
            console.log("INVALID FILE CONFIGURATION");
            console.error(err);
        }
    }

    if (imp.files[0])
        fr.readAsText(imp.files[0]);
    else
        console.log("Please import a file.");
}

export function buildText()
{
    let formatter = document.getElementById("formatter");
    let oldText = formatter.innerHTML;
    formatter.innerHTML = formatter.innerHTML.split(/<br>/g).join("\\n");
    globalText = formatter.textContent;
    formatter.innerHTML = oldText;

    let tT = document.getElementById("title");
    let title = tT.innerText;

    let gDir;
    let gFile;

    if (title.includes("/"))
    {
        let content = document.getElementById("title").innerText.split("/");
        gDir = content[0];
        gFile = content[1];
    }

    if (document != "undefined")
    {
        let token = document.cookie.split("api_token=")[1].split(";")[0];

        if (!gDir && !gFile)
            alert("Please select a file");

        if (gDir && gFile)
        {
            let file = fileSystem[gDir].files.find(f => f.fileName == gFile);

            if (file)
            {
                file.text = globalText;

                fetch("/api/filesaver", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(fileSystem)
                }).then(res => res.json()).then(data =>
                {
                    let zip = new JSZip();
                    zip.file("import-settings.json", JSON.stringify(fileSystem, null, 4));

                    data.folders.forEach(folder =>
                    {
                        let fol;

                        if (folder.name == "root")
                            fol = zip;
                        else
                        {
                            fol = zip.folder(folder.name);
                        }

                        folder.files.forEach(file =>
                        {
                            if (file.name.endsWith(".json"))
                                file.text = JSON.stringify(file.text, null, 4);

                            fol.file(file.name, file.text.replace(/\\n/g, "\r\n").replace(/⠀/g, "\r\n"));
                        });
                    });

                    zip.generateAsync({ type: "blob" }).then((content) =>
                    {
                        saveAs(content, `${data.name}.zip`);
                    });
                }).catch(err =>
                {
                    console.error(err);
                })
            }
        }
    }
}

function getOffset(el)
{
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop))
    {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function spawnMenu(type, { top, left }, target, parent)
{
    switch (type)
    {
        case "Folder":
            let folderMenu = document.getElementById("folderMenu");
            folderMenu.toggleAttribute("disabled");
            folderMenu.style.top = `${top}px`;
            folderMenu.style.left = `${left}px`;
            folderMenu.focus();
            folderMenu.setAttribute("root-folder", `${parent ? `${parent}/` : ""}${target}`);
            folderMenu.setAttribute("target", target);
            break;

        case "File":
            let fileMenu = document.getElementById("fileMenu");
            fileMenu.toggleAttribute("disabled");
            fileMenu.style.top = `${top}px`;
            fileMenu.style.left = `${left}px`;
            fileMenu.focus();
            fileMenu.setAttribute("target", target);
            break;
    }
}

export function ContextMenu(e)
{
    switch (e.target.nodeName)
    {
        case "P":
            let par = e.target.parentNode.parentNode.parentNode;
            if (par.id == "editorContainer")
                parent = "";
            else
                parent = par.children[0].innerText;

            spawnMenu("Folder", getOffset(e.target), e.target.innerText, parent);

            break;

        case "LI":
            spawnMenu("File", getOffset(e.target), e.target.innerText);
            break;
    }
}

export function createFile(e)
{
    let target = document.getElementById("folderMenu").getAttribute("target");
    let eye = target;

    let obj = findInParent(document.getElementById("folders").children, target);

    if (obj)
    {
        let parent = obj.parent;
        let path = obj.path;


        for (let child of document.getElementById("folders").children)
        {
            let texts = child.innerText.split(/\n/g);

            if (texts[0] == target)
            {
                parent = child;
            } else if (texts.includes(target))
            {
                parent = child;
                path = `${texts[0]}/${target}`;
            }
        }

        if (parent)
        {

            target = parent.querySelector(".files");

            let input = document.createElement("input");

            input = target.appendChild(input);
            input.focus();

            input.onkeydown = async (e) =>
            {
                if (e.key == "Enter")
                {
                    if (path)
                    {
                        let obj = findByPath(path);

                        if (obj)
                        {
                            obj.files.push({
                                fileName: input.value.trim(),
                                text: ""
                            });
                        }

                    } else
                    {

                        if (!fileSystem[eye])
                            fileSystem[eye] = {
                                files: []
                            };

                        fileSystem[eye].files.push({
                            fileName: input.value.trim(),
                            text: ""
                        });
                    }

                    target.removeChild(input);

                    await loadTemplate(fileSystem, true);

                }
            }

            document.onclick = (e) =>
            {
                e.target.focus();

                if (document.activeElement != input)
                    if (target.querySelector("input"))
                    {
                        document.onclick = () => { };
                        target.removeChild(input);
                    }
            };
        }
    }
}

function findByPath(path, fileSystemItem, oPath)
{
    let paths = path.split(/\//g);

    console.log(paths);

    if (paths.length > 1)
    {
        let item = paths.shift();

        let ite = fileSystemItem || fileSystem;


        if (oPath)
        {
            let octo;

            if (oPath.length > 1)
            {
                oPath.push(item);

                console.log(paths);

                ite = findByPath(paths.join("/"), ite[oPath[0]], oPath);
                console.log(ite);
            } else
            {
                ite = fileSystemItem[item];

                oPath.push(item);
            }

        } else
        {
            if (fileSystem[item])
                ite = fileSystemItem[item];

            oPath = [item]

        }

        return findByPath(paths.join("/"), ite, oPath);
    } else
    {
        console.log(fileSystemItem);

        return fileSystemItem[paths[0]] || fileSystemItem;
    }
}

export function createFolder(e)
{
    let root = document.getElementById("folderMenu").getAttribute("root-folder");
    let target = document.getElementById("folderMenu").getAttribute("target");
    let eye = target;

    let obj = findInParent(document.getElementById("folders").children, target, root);

    if (obj)
    {
        let parent = obj.parent;
        let path = obj.path;

        if (parent)
        {

            let input = document.createElement("input");

            input = parent.appendChild(input);
            input.focus();

            input.onkeydown = async (e) =>
            {
                if (e.key == "Enter")
                {
                    if (path)
                    {
                        let obj = findByPath(path, fileSystem);

                        if (obj)
                            if (obj.files)
                                obj.files.push({
                                    dirName: input.value.trim(),
                                    files: []
                                });
                            else
                                console.log(obj);
                    } else
                    {

                        if (!fileSystem[eye])
                            fileSystem[eye] = {
                                files: []
                            };

                        fileSystem[eye].files.push({
                            dirName: input.value.trim(),
                            files: []
                        });
                    }

                    parent.removeChild(input);

                    await loadTemplate(fileSystem, true);

                }
            }

            document.onclick = (e) =>
            {
                e.target.focus();

                if (document.activeElement != input)
                    if (parent.querySelector("input"))
                    {
                        document.onclick = () => { };
                        parent.removeChild(input);
                    }
            };
        }
    }
}

function isIterable(obj)
{
    if (obj == null)
    {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

function findInParent(parent, target, pathie, left)
{
    let start = false;

    if (left == (null))
    {
        left = pathie.split(/\//g).length;
        start = true;
    }

    let obj = {
        parent: parent[0],
        path: ""
    };

    for (let child of parent)
    {

        if (start)
        {
            let tex;

            if (child.querySelector("p"))
                tex = child.querySelector("p").innerText;

            if (tex)
                if (tex == target)
                {
                    obj.path += findInParent(child.querySelector(".files").children, target, pathie, left - 1).path + "/";
                }
        } else
        {
            if(left > 0){
                if (tex == target)
                {
                    obj.path += findInParent(child.querySelector(".files").children, target, pathie, left - 1).path + "/";
                }
            } else {
                console.log("[--] - [--]")
                console.log(obj);
            }
        }
    }

    return obj;
}