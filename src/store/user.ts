import { persistentAtom } from '@nanostores/persistent'

export const user = persistentAtom('user', JSON.stringify({
    _id: "",
    name: "",
    email: "",
    password: ""

}))

export const users = persistentAtom<any>('users', [])