// function a(){
//     console.log("A");
// }

const a = function(){           // JS에서는 함수 = 값
    console.log("A");
}

function slowFunc(callback){    // 비동기함수로 만드는 방법
    callback();
}
slowFunc(a);                    // 'a' 라는 함수를 slowFunc() 을 통해 callback() 을 하게되면 비동기로 호출됨