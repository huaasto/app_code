import { githubReq, localReq } from '@/utils/req'
const isDev = process.env.NODE_ENV === 'development'


export function getToDoList(par) {
  return isDev
    ? githubReq.get('/repos/huaasto/sdfs/issues', par)
    : localReq.post('/issue/query', par)
}

export function createToDoItem(par) {
  return isDev
    ? githubReq.post('/repos/huaasto/sdfs/issues', par)
    : localReq.post('/issue/add', par)
}

export function editToDoItem({ number, par }) {
  return isDev
    ? Promise.resolve({ code: 404, msg: '本地测试暂不支持修改issue' })
    : localReq.post('/issue/edit', Object.assign(par, { number }))
}
export function lockToDoItem({ number, par }) {
  return isDev
    ? githubReq.put('/repos/huaasto/sdfs/issues/' + number + '/lock', par, false)
    : localReq.post('/issue/lock', { number }, false)
}

export function unlockToDoItem({ number, par }) {
  return isDev
    ? githubReq.delete('/repos/huaasto/sdfs/issues/' + number + '/lock', par, false)
    : localReq.post('/issue/unlock', { number }, false)
}
