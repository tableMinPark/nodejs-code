const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');
const res = require('express/lib/response');
const template = require('../lib/template_express.js');

router.get('/create', function(request, response){
    const title = "WEB - create";
    const list = template.list(request.list);
    const html = template.html(title, list, `
        <form action="/create_process" method="post">
            <P><input type="text" name="title" placeholder="title"></p>
            <P><textarea name="description" placeholder="description"></textarea></p>
            <P><input type="submit"></p>
        </form>
    `, "");
    response.send(html);
});

router.post('/create_process', function(request, response){    
    // body-parser 사용하지않은 코드

    // let body = "";
    // // "data" 이벤트가 발생하면 핸들러를 실행시키고 데이터를 계속 받음
    // request.on('data', function(data){
    //     body = body + data;
    // });
    // // 위의 "data" 이벤트 핸들러가 데이터를 다 받으면 "end" 이벤트가 발생되어 핸들러를 실행시킴
    // request.on('end', function(){
    //     // body => "title=a&description=b"
    //     const post = qs.parse(body);        // 사용자에게 입력받은 body
    //     const title = post.title;
    //     const description = post.description;
    //     fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
    //         response.redirect(`/page/${title}`);
    //     })
    // });
    
    // body-parser 사용한 코드

    const post = request.body;      // body-parser 를 통해 request 의 body 를 자동으로 분리해줌
    const title = post.title;
    const description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
        response.redirect(`/topic/${title}`);
    })
});

router.get('/update/:pageId', function(request, response){
    const filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf-8", function(err, description){
        const title = request.params.pageId;                
        const list = template.list(request.list);                    
        const html = template.html(title, list, 
            `
            <form action="/topic/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <P><input type="text" name="title" placeholder="title" value="${title}"></p>
                <P><textarea name="description" placeholder="description">${description}</textarea></p>
                <P><input type="submit"></p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        );
        response.send(html);
    })
});

router.post('/update_process', function(request, response){
    // let body = "";
    // request.on("data", function(data){
    //     body = body + data;
    // });
    // request.on("end", function(){
    //     const post = qs.parse(body);
    //     const id = post.id;
    //     const title = post.title;
    //     const description = post.description;
    //     fs.rename(`data/${id}`, `data/${title}`, function(err){
    //         fs.writeFile(`data/${title}`, description, "utf-8", function(err){
    //             response.redirect(`/page/${title}`);
    //         })
    //     })
        
    // });

    const post = request.body;        // body-parser 를 통해 request 의 body 를 자동으로 분리해줌
    const id = post.id;
    const title = post.title;
    const description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, "utf-8", function(err){
            response.redirect(`/topic/${title}`);
        })
    })
});

router.post('/delete_process', function(request, response){
    // let body = "";
    // request.on("data", function(data){
    //     body = body + data;
    // });
    // request.on("end", function(){
    //     const post = qs.parse(body);
    //     const id = post.id;            
    //     const filteredId = path.parse(id).base;
    //     fs.unlink(`data/${filteredId}`, function(err){
    //         response.redirect(`/`);
    //     })
    // });    
    const post = request.body;      // body-parser 를 통해 request 의 body 를 자동으로 분리해줌
    const id = post.id;            
    const filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(err){
        response.redirect(`/`);
    })    
});

router.get('/:pageId', function(request, response, next){
    // localhost:3000/page/HTML => {pageId: "HTML"} : pageId 자리에 입력하는 값이 request를 통해 전달됨 (?pageId=HTML 과는 다른방식)
    const filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, "utf-8", function(err, description){
        if (err){
            // 파일을 찾을 때 에러(파일이 없을 때 발생)가 발생하면 next를 통해 err를 아래 미들웨어로 전달
            next(err);
        } else{
            const title = request.params.pageId;    
            const sanitizeTitle = sanitizeHtml(title);  
            const sanitizeDescription = sanitizeHtml(description, {
                allowedTags: ["h1"]
            });
            const list = template.list(request.list);                    
            const html = template.html(title, list, 
                `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
                `
                <a href="/topic/create">create</a> 
                <a href="/topic/update/${sanitizeTitle}">update</a>
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizeTitle}">
                    <input type="submit" value="delete">
                </form>
                `
            );
            response.send(html);
        }

        
    })
});

module.exports = router;