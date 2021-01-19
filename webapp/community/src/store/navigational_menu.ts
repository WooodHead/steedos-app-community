import {types, getEnv} from 'mobx-state-tree';
import {PageStore} from './Page';
export const NavigationalMenuStore = types
    .model('NavigationalMenu', {
        _id: types.identifier,
        name: '',
        url: types.maybeNull(types.string),
        type: types.maybeNull(types.string),
        page: types.maybeNull(PageStore),
        event: types.maybeNull(types.string)
    })
    .views(self => ({}))
    .actions(self => ({}))

export type IPageStore = typeof NavigationalMenuStore.Type;
