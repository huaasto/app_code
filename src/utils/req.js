
function Req(url) {
  this.url = url
  this.get = (address, params, parse) => {
    return reqFn('get', url + address, params, parse)
  }
  this.post = (address, params, parse) => {
    return reqFn('post', url + address, params, parse)
  }
  this.delete = (address, params, parse) => {
    return reqFn('delete', url + address, params, parse)
  }
  this.put = (address, params, parse) => {
    return reqFn('put', url + address, params, parse)
  }
  this.patch = (address, params, parse) => {
    return reqFn('patch', url + address, params, parse)
  }
}

function initParams(obj) {
  return '?' + Object.keys(obj).map(e => `${e}=${obj[e]}`).join('&')
}

function reqFn(method, url, params, parse = true, header) {
  const obj = {
    method: method,
    headers: Object.assign({
      'accept': 'application/vnd.github.v3+json',
      'Authorization': 'token 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'
    }, header)
  }
  if (params) {
    method === 'get' ? (url += initParams(params)) : obj.body = JSON.stringify(params)
  }
  return fetch(url, obj).then(data => { return parse ? data.json() : data.text() })
}

// token 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

export const githubReq = new Req("https://api.github.com")
// export const githubReq = new Req(process.env.VUE_APP_BASE_URL_BASEURL)


/*
      Fetch API 调用接口传递参数
    */

// GET参数传递-传统URL
// fetch('http://localhost:3000/books?id=123', {
//   method: 'get'
// })
//   .then(function(data){
//     return data.text();
//   }).then(function(data){
//     console.log(data)
//   });

// GET参数传递-restful形式的URL
// fetch('http://localhost:3000/books/456', {
//   method: 'get'
// })
//   .then(function(data){
//     return data.text();
//   }).then(function(data){
//     console.log(data)
//   });

// DELETE请求方式参数传递
// fetch('http://localhost:3000/books/789', {
//   method: 'delete'
// })
//   .then(function(data){
//     return data.text();
//   }).then(function(data){
//     console.log(data)
//   });

// POST请求传参
// fetch('http://localhost:3000/books', {
//   method: 'post',
//   body: 'uname=lisi&pwd=123',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }
// })
//   .then(function(data){
//     return data.text();
//   }).then(function(data){
//     console.log(data)
//   });

// POST请求传参
// fetch('http://localhost:3000/books', {
//   method: 'post',
//   body: JSON.stringify({
//     uname: '张三',
//     pwd: '456'
//   }),
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })
//   .then(function(data){
//     return data.text();
//   }).then(function(data){
//     console.log(data)
//   });

// PUT请求传参
// fetch('http://localhost:3000/books/123', {
//   method: 'put',
//   body: JSON.stringify({
//     uname: '张三',
//     pwd: '789'
//   }),
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })
//   .then(function(data){
//     return data.text();
//   }).then(function(data){
//     console.log(data)
//   });
