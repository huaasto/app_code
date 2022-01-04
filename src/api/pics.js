import { githubReq, localReq } from '@/utils/req'
const isDev = process.env.NODE_ENV === 'development'


export function getPicList(par) {
  return isDev
    ? githubReq.get('/repos/huaasto/pics/contents' + (par.path || ''))
    : localReq.post('/pics/list' + (par.path || ''))
}

export function createPic(par) {
  return isDev
    ? githubReq.put('/repos/huaasto/pics/contents' + (par.path || '/') + par.name, par)
    : localReq.post('/pics/create' + (par.path || '/') + par.name, par)
}

export function deletePic(par) {
  return isDev
    ? githubReq.delete("/repos/huaasto/pics/contents" + (par.path || '/') + (par.name || ''), par)
    : localReq.post('/pics/delete', par)
}

