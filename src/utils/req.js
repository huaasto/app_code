

var githubToken = ''
var token = ''
if (sessionStorage.token || token) {
  token = sessionStorage.token
  githubToken = sessionStorage.githubToken
  sessionStorage.removeItem('githubToken')
  sessionStorage.removeItem('token')
}
fetch('/login', {
  method: 'POST',
  headers: {
    token: token
  }
}).then((res) => res.json()).then(data => {
  if (data.code) return location.href = 'login'
})
if (token) {
  window.onbeforeunload = () => {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('githubToken', githubToken)
  }
}




function Req(url, headers) {
  this.url = url
  this.get = (address, params, parse) => {
    return reqFn('get', url + address, params, parse, headers)
  }
  this.post = (address, params, parse) => {
    return reqFn('post', url + address, params, parse, headers)
  }
  this.delete = (address, params, parse) => {
    return reqFn('delete', url + address, params, parse, headers)
  }
  this.put = (address, params, parse) => {
    return reqFn('put', url + address, params, parse, headers)
  }
  this.patch = (address, params, parse) => {
    return reqFn('patch', url + address, params, parse, headers)
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
      'token': token
    }, header)
  }
  if (params) {
    method === 'get' ? (url += initParams(params)) : obj.body = JSON.stringify(params)
  }
  return fetch(url, obj).then(data => {
    if (data.status >= 400)
      return { code: data.status, msg: "请求失败，请联系管理员" }
    return parse ? data.json() : data.text()
  }).catch(err => {
    return { code: 404, msg: "请求出错，请联系管理员" }
  })
}

// token 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

export const githubReq = new Req("https://api.github.com")
export const localReq = new Req("https://try.compusrecorder.cf")
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
