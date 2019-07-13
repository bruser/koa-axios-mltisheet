const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa-cors');
const http = require('koa2-request');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const axios = require('axios');
const excel = require('./util/excel');
const fs = require('fs');
const path = require('path');
const {setAxios,entrys,requestArr,getArrData} = require('./util/common');

let router = new Router();
let params = {
    bizType: 'A002',
    windId: '9051B26F848318D36B6AFC78E4A6DE42',
    pageIndex: 1,
    pageSize: 10,
    fromDate: null,
    toDate: null
};
let wsid = '282b416dd445490b8e566baf60cd0cbf';
// let url = 'http://10.10.100.42/wind.ent.risk/test/openapi/corpinfo?wind.sessionid=' + wsid;

router.get('/', async (ctx) => {
    let data = await axios.all(requestArr);
    let data1 = data.map((item)=>getArrData(item.data));

    // ctx.response.body = data1;
        // .then(axios.spread(function (acct, perms) {
        //     // 两个请求现在都执行完成
        // }))
    // // // // //生成xlsx文件
    await excel(data1);
    // // // // //类型
    ctx.type = '.xlsx';
    // //请求返回，生成的xlsx文件
    console.log(fs.readFileSync('output.xlsx'))
    ctx.body = fs.readFileSync('output.xlsx');

    // //请求返回后，删除生成的xlsx文件，不删除也行，下次请求回覆盖
    fs.unlink('output.xlsx');


});

router.post('/getExcel', async (ctx) => {
    // console.log(ctx.request.body)// binggo
    // let data =  await axios.post(url,params);
    // ctx.response.body = data.data.data;



    // ctx.response.body = JSON.stringify({name:111})
    // let res =  await http('https://114.80.154.45/Wind.WFC.Enterprise.Web//Enterprise/WebApi.aspx?cmd=gethistorykey&s=1562121833113');
    // ctx.response.body = JSON.stringify({name:11});
});

// 根据这个参数直接去发请求生成对应的 json



router.get('/about', (ctx) => {
    ctx.response.body = 'about hello world'
})

app.use(cors());
app.use(bodyParser());
app.use(router.routes());


app.listen(1111);

console.log('listening 1111...')