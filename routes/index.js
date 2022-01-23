const express = require('express');
const router = express.Router();

const template = require('../lib/template_express.js');

app.get('/', function(request, response){
    const title = "Welcome";
    const description = "Hello, Node.js";
    const list = template.list(request.list);
    const html = template.html(title, list, 
        `<h2>${title}</h2>${description}
        <img src="/images/develop.jpg" style="width:300px; display:block; margin:10px;">
        `,
        `<a href="/create">create</a>`
    );
    response.send(html);
});

module.exports = router;