const axios = require('axios');
const config = require('../config/config');
const entrys = Object.keys(config);
const setAxios = (url) => axios.get(url);

let url1 = 'https://api2.dianjingquan.cn:3008/match/query/list?page=1&page_count=40&key=&status=all&game_id=0';
let url2 = 'https://api2.dianjingquan.cn:3008/event/list?page=1&page_count=5&uid=23558&access_token=ZWFmNmI2NzItYjgxMC00YzExLTk4NWMtYjA0YzhjZGM2ZGI5OjIzNTU4OjE1NjI5NDEwNjE5NDI%3D';
let url3 = 'https://api2.dianjingquan.cn:3008/news/home/list';

let arr = [url1,url2,url3];
let requestArr = [];

arr.forEach((item, index) => {
    requestArr.push(setAxios(item));
})

const getArrData = (data) => {//数据结构差异，判断需要渲染的数组
    if (data && typeof (data) == 'object') {
        if (Array.isArray(data)) {
            return data
        } else if (Array.isArray(data.matchs)) {
            return data.matchs
        } else if (Array.isArray(data.data)) {
            return data.data
        } else {
            return [data]
        }
    }
}
// json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
//     v: v[k],
//     position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
// }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
//     v: v.v
// });
// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
const getCharCol = (n) => {
    let temCol = '',
        s = '',
        m = 0
    while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
    }
    return s
}
const handelExecl = (data) => {//返回 最终的 workbook 对象
    let _headers = Object.keys(data[0]);
    let _data = data;
    let headers = _headers
        .map((v, i) => Object.assign({}, {
            v: v,
            position: i>25?getCharCol(i)+1:String.fromCharCode(65 + i) + 1
        })
        )// prev  回调的返回值  next是当前的值
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
    let data1 = _data
        .map((v, i) => _headers.map((k, j) => Object.assign({}, {
            v: v[k],
            position: j>25?getCharCol(j)+(i+2):String.fromCharCode(65 + j) + (i + 2)
        })))//
        .reduce((prev, next) => prev.concat(next))
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
    // // 合并 headers 和 data
    let output = Object.assign({}, headers, data1);
    let outputPos = Object.keys(output);
    // // 计算出范围
    let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    return Object.assign({}, output, { '!ref': ref })
}

module.exports = {
    setAxios,
    entrys,// 代表几张表
    requestArr,
    getArrData,
    handelExecl
}