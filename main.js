const http = require("http");     // http 모듈
const fs = require("fs");         // fileSystem 모듈
const url = require("url");       // url 모듈
const qs = require("querystring");
const path = require("path/posix");

function templateHTML(title, list, body, control){
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
        ${control}
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
                const template = templateHTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);     
                response.end(template);
            })
        } else{
            fs.readdir("./data", function(err, filelist){
                fs.readFile(`data/${queryData.id}`, "utf-8", function(err, description){
                    const title = queryData.id;                
                    const list = templateList(filelist);                    
                    const template = templateHTML(title, list, 
                        `<h2>${title}</h2>${description}`,
                        `
                        <a href="/create">create</a> 
                        <a href="/update?id=${title}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>
                        `
                    );
                    response.writeHead(200);     
                    response.end(template);
                })
            });
        }
    } else if (pathname === "/create"){
        fs.readdir("./data", function(err, filelist){
            const title = "WEB - create";
            const list = templateList(filelist);
            const template = templateHTML(title, list, `
                <form action="/create_process" method="post">
                    <P><input type="text" name="title" placeholder="title"></p>
                    <P><textarea name="description" placeholder="description"></textarea></p>
                    <P><input type="submit"></p>
                </form>
            `, "");
            response.writeHead(200);     
            response.end(template);
        })
    } else if (pathname === "/create_process"){
        let body = "";
        request.on("data", function(data){
            body = body + data;
        });
        request.on("end", function(){
            const post = qs.parse(body);
            const title = post.title;
            const description = post.description;
            fs.writeFile(`data/${title}`, description, "utf-8", function(err){
                response.writeHead(302, {Location: `/?id=${title}`});               // 입력된 데이터가 표시되는 View로 리다이렉트
                response.end();
            })
        });

        
    } else if (pathname === "/update"){
        fs.readdir("./data", function(err, filelist){
            fs.readFile(`data/${queryData.id}`, "utf-8", function(err, description){
                const title = queryData.id;                
                const list = templateList(filelist);                    
                const template = templateHTML(title, list, 
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <P><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <P><textarea name="description" placeholder="description">${description}</textarea></p>
                        <P><input type="submit"></p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);     
                response.end(template);
            })
        });
    } else if (pathname === "/update_process"){
        let body = "";
        request.on("data", function(data){
            body = body + data;
        });
        request.on("end", function(){
            const post = qs.parse(body);
            const id = post.id;
            const title = post.title;
            const description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`, description, "utf-8", function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            })
            
        });
    } else if (pathname === "/delete_process"){
        let body = "";
        request.on("data", function(data){
            body = body + data;
        });
        request.on("end", function(){
            const post = qs.parse(body);
            const id = post.id;
            fs.unlink(`data/${id}`, function(err){
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        });        
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});

app.listen(3000);