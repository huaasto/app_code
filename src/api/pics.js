import { githubReq, localReq, devReq } from '@/utils/req'
const isDev = process.env.NODE_ENV === 'development'


// export function getPicList(params) {
//   return isDev
//     ? githubReq.get('/repos/huaasto/pics/contents' + (params.path || ''))
//     : localReq.post('/pics/list' + (params.path || ''))
// }getMiniPicList
export function getPicList(params) {
  return isDev
    // ? githubReq.get('/repos/huaasto/pics/contents' + (params.path || ''))
    ? devReq.post('/pics/list', params)
    : localReq.post('/pics/list', params)
}
export function getMiniPicList(params) {
  return isDev
    // ? githubReq.get('/repos/huaasto/minipics/contents' + (params.path || ''),)
    ? devReq.post('/pics/list/mini', params)
    : localReq.post('/pics/list/mini', params)
}
export function getPicItem(params) {
  return isDev
    // ? githubReq.get('/repos/huaasto/pics/contents' + (params.path || ''))
    ? devReq.post('/pics/item', params)
    : localReq.post('/pics/item', params)
}

export function createPic(params) {
  return isDev
    ? devReq.post('/pics/create', params)
    : localReq.post('/pics/create', params)
}

export function createMiniPic(params) {
  return isDev
    // ? githubReq.put('/repos/huaasto/minipics/contents' + (params.path || '/') + params.name, params)
    ? devReq.post('/pics/create/mini', params)
    : localReq.post('/pics/create/mini', params)
}

export function deletePic(params) {
  return isDev
    // ? githubReq.delete("/repos/huaasto/pics/contents" + (params.path || '/') + (params.name || ''), params)
    ? devReq.post('/pics/delete', params)
    : localReq.post('/pics/delete', params)
}

export function deleteMiniPic(params) {
  return isDev
    // ? githubReq.delete("/repos/huaasto/minipics/contents" + (params.path || '/') + (params.name || ''), params)
    ? devReq.post('/pics/delete/mini', params)
    : localReq.post('/pics/delete/mini', params)
}

