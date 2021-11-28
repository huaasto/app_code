import { githubReq, localReq } from '@/utils/req'

// export function getToDoList(par) {
//   return githubReq.get('/repos/huaasto/sdfs/issues', par)
// }

// export function createToDoItem(par) {
//   return githubReq.post('/repos/huaasto/sdfs/issues', par)
// }

// export function editToDoItem({ number, par }) {
//   return githubReq.patch('/repos/huaasto/sdfs/issues/' + number, par)
// }
// export function lockToDoItem({ number, par }) {
//   return githubReq.put('/repos/huaasto/sdfs/issues/' + number + '/lock', par, false)
// }

// export function unlockToDoItem({ number, par }) {
//   return githubReq.delete('/repos/huaasto/sdfs/issues/' + number + '/lock', par, false)
// }


export function getToDoList(par) {
  return localReq.post('/issue/query', par)
}

export function createToDoItem(par) {
  return localReq.post('/issue/add', par)
}

export function editToDoItem({ number, par }) {
  return localReq.post('/issue/edit', Object.assign(par, { number }))
}
export function lockToDoItem({ number }) {
  return localReq.post('/issue/lock', number, false)
}

export function unlockToDoItem({ number }) {
  return localReq.post('/issue/unlock', number, false)
}
