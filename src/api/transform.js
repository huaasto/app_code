import * as issues from "./todo"
import * as issues_github from "./todo_local"

const isDev = process.env.NODE_ENV === 'development'
export default isDev ? {
  ...issues_github
} : {
  ...issues
}
// if (isDev){
//   export * from './todo_local'
// } else{
//   export * from './todo'
// }

