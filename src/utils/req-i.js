
import axios from "axios";


function createReq(url, contentType) {
  // const source = axios.CancelToken.source();
  const req = axios.create({
    baseURL: url,
    headers: {
      post: {
        "Content-Type": contentType || "application/json;charset=UTF-8",
      },
    },
    validateStatus: () => true,
  });
  // 请求拦截器
  req.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("Authorization");
      token && (config.headers.Authorization = token);
      return config;
    },
    (err) => {
      err.data = {
        msg: "服务器异常，请联系管理员",
      };
      alert("服务器异常，请联系管理员");
      return Promise.resolve(err);
    }
  );

  // 响应拦截器
  req.interceptors.response.use(
    (res) => {
      errHandle(res.status, res.data);
      return res;
    },
    (err) => {
      err.data = {};
      if (!window.navigator.onLine) {
        console.log("网络已断开");
        alert("网络异常，请检查网络是否正常连接");
        err.data.msg = "网络异常，请检查网络是否正常连接";
      } else if (err.code === "ECONNABORTED") {
        console.log("请求超时");
        alert("请求超时");
        err.data.msg = "请求超时";
      } else {
        console.log("服务器异常");
        alert("服务器异常，请联系管理员");
        err.data.msg = "服务器异常，请联系管理员";
      }
      return Promise.resolve(err);
    }
  );
  return req;
}

export const githubReq = createReq(process.env.VUE_APP_BASE_URL_BASEURL);

export const linkReq = function (url, fileName) {
  const elink = document.createElement("a");
  elink.style.display = "none";
  elink.href = url;
  if (fileName) { // 由于非同源download不生效
    elink.download = fileName;
  }
  elink.click();
  elink.remove();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
};

function linkTo(url) {
  history.replaceState({}, "", url);
  location.reload();
}

function errHandle(status, data) {
  switch (status) {
    case 400:
      alert("请确认数据格式，再次请求");
      break;
    case 401:
      alert("服务器异常，请联系管理员");
      break;
    case 403:
      // 处理token过期问题
      localStorage.removeItem("Authorization");
      setTimeout(() => {
        linkTo("/login");
      }, 1000);
      break;
    case 404:
      // 处理404
      alert("服务器异常，请联系管理员");
      break;
    // default: console.log(data)
  }
  if (status === 200 && data) {
    switch (data.code) {
      case 403:
        // 处理token过期问题
        localStorage.removeItem("Authorization");
        setTimeout(() => {
          linkTo("/login");
        }, 1000);
        break;
    }
  }
}


export function tryReq(url) {
  return createReq(url)
}
// tryReq();
