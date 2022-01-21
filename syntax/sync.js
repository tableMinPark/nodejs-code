const fs = require("fs");

// readFileSync (동기식)
// console.log("A");
// const result = fs.readFileSync("syntax/sample.txt", "utf-8");
// console.log(result);
// console.log("C");

// readFile (비동기식)
console.log("A");
fs.readFile("syntax/sample.txt", "utf-8", function(err, result){        // 또 다른 쓰레드로 분리하여 병렬로 실행되는 원리랑 똑같음
    console.log(result);
});
console.log("C");