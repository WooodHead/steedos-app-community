import {types, getEnv} from 'mobx-state-tree';
export const UserInfoStore = types
    .model('UserInfo', {
        _id: types.maybeNull(types.string),
        name: types.maybeNull(types.string),
        avatar: types.maybeNull(types.string),
    })
    .views(self => ({}))
    .actions(self => ({}))

export type IPageStore = typeof UserInfoStore.Type;
