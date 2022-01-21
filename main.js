const http = require("http");     // http 모듈
const fs = require("fs");         // fileSystem 모듈
const url = require("url");       // url 모듈

function templateHTML(title, list, body){
    return  `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${body}
    </body>
    </html>
    `;            
}

function templateList(filelist){
    let list = "<ul>";
    let i = 0;
    while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + "</ul>";
    return list;
}

const app = http.createServer(function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if (pathname === "/"){
        if (queryData.id === undefined){
            fs.readdir("./data", function(err, filelist){
                const title = "Welcome";
                const description = "Hello, Node.js";
                const list = templateList(filelist);
                const template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                response.writeHead(200);     
                response.end(template);
            })
        } else{
            fs.readdir("./data", function(err, filelist){
                fs.readFile(`data/${queryData.id}`, "utf-8", function(err, description){
                    const title = queryData.id;                
                    const list = templateList(filelist);                    
                    const template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    response.writeHead(200);     
                    response.end(template);
                })
            });
        }
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});

app.listen(3000);