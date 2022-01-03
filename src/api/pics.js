import { githubReq, localReq } from '@/utils/req'
const isDev = process.env.NODE_ENV === 'development'


export function getPicList() {
  return isDev
    ? githubReq.get('/repos/huaasto/pics/contents')
    : localReq.post('/pics/list')
}

export function createPic(par) {
  return isDev
    ? githubReq.put('/repos/huaasto/pics/contents' + par.name, par)
    : localReq.post('/pics/create/' + par.name, par)
}

export function deletePic(par) {
  return isDev
    ? githubReq.delete("/repos/huaasto/pics/contents" + par.name, par)
    : localReq.post('/pics/delete/' + par.name, par)
}

