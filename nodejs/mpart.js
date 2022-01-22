const M = {
    v: 'v',
    f: function(){
        console.log(this.v);
    }
}

module.exports = M;     // 객체 M 을 다른 파일에서 참조할 수 있게 Exports