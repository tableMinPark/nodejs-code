const roles = {
    'programmer': 'PSM',
    'designer': 'KSH',
    'manager': 'PSU',
}

// 객체에서 요소 호출하기 (파이썬 in 문법과 동일)
for (let name in roles){
    console.log(`key : ${name} / value : ${roles[name]}`);
}