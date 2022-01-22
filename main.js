const http = require("http");     // http 모듈
const fs = require("fs");         // fileSystem 모듈
const url = require("url");       // url 모듈
const qs = require("querystring");
const path = require("path");
const sanitizeHtml = require("sanitize-html");

const template = require("./lib/template.js");

const app = http.createServer(function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if (pathname === "/"){
        if (queryData.id === undefined){
            fs.readdir("./data", function(err, filelist){
                const title = "Welcome";
                const description = "Hello, Node.js";
                const list = template.list(filelist);
                const html = template.html(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);     
                response.end(html);
            })
        } else{
            fs.readdir("./data", function(err, filelist){
                const filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, "utf-8", function(err, description){
                    const title = queryData.id;    
                    const sanitizeTitle = sanitizeHtml(title);  
                    const sanitizeDescription = sanitizeHtml(description, {
                        allowedTags: ["h1"]
                    });
                    const list = template.list(filelist);                    
                    const html = template.html(title, list, 
                        `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
                        `
                        <a href="/create">create</a> 
                        <a href="/update?id=${sanitizeTitle}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizeTitle}">
                            <input type="submit" value="delete">
                        </form>
                        `
                    );
                    response.writeHead(200);     
                    response.end(html);
                })
            });
        }
    } else if (pathname === "/create"){
        fs.readdir("./data", function(err, filelist){
            const title = "WEB - create";
            const list = template.list(filelist);
            const html = template.html(title, list, `
                <form action="/create_process" method="post">
                    <P><input type="text" name="title" placeholder="title"></p>
                    <P><textarea name="description" placeholder="description"></textarea></p>
                    <P><input type="submit"></p>
                </form>
            `, "");
            response.writeHead(200);     
            response.end(html);
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
            const filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, "utf-8", function(err, description){
                const title = queryData.id;                
                const list = template.list(filelist);                    
                const html = template.html(title, list, 
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
                response.end(html);
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
            const filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err){
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