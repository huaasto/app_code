import { Notify } from 'quasar'

const isDev = process.env.NODE_ENV === 'development'
var githubToken = ''
var token = ''
var Authorization = ''
if (isDev) {
  Authorization = localStorage.Authorization
} else {
  if (Date.now() - (+localStorage.lastLoginTime) >= 1000 * 60 * 60 * 24 * 7) {
    localStorage.removeItem(githubToken)
    localStorage.removeItem(token)
  }
  const currentToken = localStorage.token || token
  if (currentToken) {
    // token = sessionStorage.token
    // githubToken = sessionStorage.githubToken
    token = currentToken
    githubToken = localStorage.githubToken
    // sessionStorage.removeItem('githubToken')
    // sessionStorage.removeItem('token')
  }
  if (token) {
    window.onbeforeunload = () => {
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('githubToken', githubToken)
    }
  }
}


console.log(process.env.NODE_ENV)

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
    headers: Object.assign({}, header)
  }
  console.log('in reqFn' + token)
  if (params) {
    method === 'get' ? (url += initParams(params)) : obj.body = JSON.stringify(params)
  }
  return fetch(url, obj).then(data => {
    switch (data.status) {
      case 400:
        console.log("请确认数据格式，再次请求");
        Notify.create({
          message: '请确认数据格式，再次请求',
          color: 'red'
        })
        break;
      case 401:
        console.log("服务器异常，请联系管理员");
        Notify.create({
          message: '服务器异常，请联系管理员',
          color: 'red'
        })
        break;
      case 403:
        // 处理token过期问题
        isDev || (location.href = '/login')
        break;
      case 404:
        // 处理404
        console.log("服务器异常，请联系管理员")
        Notify.create({
          message: '服务器异常，请联系管理员',
          color: 'red'
        })
        break;
      // default: console.log(data)
    }
    return parse ? data.json() : data.text()
  }).catch(err => {
    return { code: 404, msg: "请求出错，请联系管理员" }
  })
}



export const githubReq = new Req("https://api.github.com", {
  'accept': 'application/vnd.github.v3+json',
  Authorization
})
export const localReq = new Req("", {
  'accept': 'application/vnd.github.v3+json',
  'token': token || 'noToken'
})

// export const localReq = new Req("https://try.compusrecorder.cf")
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
