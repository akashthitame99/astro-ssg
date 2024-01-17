import { atom } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'


export const $userInfo = persistentAtom<any>("user", JSON.stringify({ username: "akash" }))