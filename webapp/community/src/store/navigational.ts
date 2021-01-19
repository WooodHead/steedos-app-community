import {types, getEnv} from 'mobx-state-tree';
import {NavigationalMenuStore} from './navigational_menu';
export const NavigationalStore = types
    .model('Navigational', {
        _id: types.identifier,
        name: '',
        menus: types.optional(types.array(NavigationalMenuStore), [])
    })
    .views(self => ({}))
    .actions(self => ({}))

export type IPageStore = typeof NavigationalStore.Type;
