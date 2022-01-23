const express = require('express');
const app = express();

const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');

// app.get('/', (req, res) => res.send('Hello world!'));        // arrow 방식 (신세대방식)
// app.get('/', function(req, res){                             // function 을 사용하는 방식 (구세대방식)
//     res.send('Hello world!');
// })

// Application-level middleware
app.use(helmet());
app.use(express.static('public'));                      // 정적인 파일에 접근할 수 있는 폴더를 지정해줘야함 (지정한 폴더는 URL을 통해 접근을 할 수 있음)
app.use(bodyParser.urlencoded({extended: false}));      // body-parser 미들웨어 탑재 (request로 들어오는 body 를 자동으로 파싱해줌)
app.use(compression());                                 // compression 미들웨어 탑재 (데이터를 압축하여 네트워크 비용을 줄임)
app.get('*', function(request, response, next){         // get 방식으로 들어오는 모든 요청에 미들웨어사용
    fs.readdir("./data", function(err, filelist){
        request.list = filelist;
        next();
    });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);

// 미들웨어는 순차적으로 실행되기 때문에 마지막에 위치해야함 (404 Error)
app.use(function(request, response, next){
    response.status(404).send('Sorry cant find that!');
});

// 파일을 찾을 때 발생한 에러(파일이 없을 때 발생)를 받음
app.use(function(err, request, response, next){
    console.error(err.stack);
    response.status(500).send('Something broke!');
})

app.listen(3000, () => console.log('Example app listening on port 3000!'));