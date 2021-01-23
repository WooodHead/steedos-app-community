import {types, getEnv} from 'mobx-state-tree';
import {NavigationalMenuStore} from './Navigation_menu';
export const NavigationalStore = types
    .model('Navigational', {
        _id: types.identifier,
        name: '',
        menus: types.optional(types.array(NavigationalMenuStore), [])
    })
    .views(self => ({}))
    .actions(self => ({}))

export type INavigationalStore = typeof NavigationalStore.Type;
