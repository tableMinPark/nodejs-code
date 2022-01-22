const f = function(){       // 함수를 변수에 담을 수 있기 때문에 "함수 = 값" 임
    console.log(1 + 1);
}
const a = [f];              // 함수를 배열에도 담을 수 있음 ("함수 = 값" 이기 때문)
a[0]();
const o = {                 // 함수를 객체에도 담을 수 있음 ("함수 = 값" 이기 때문)
    func: f
}
o.func();
// 함수를 변수처럼 사용할 수 있다!

const o2 = {
    v1: 'v1',
    v2: 'v2',
    f1: function (){
        console.log(this.v1);
    },
    f2: function (){
        console.log(this.v2);
    }
}

o2.f1();
o2.f2();