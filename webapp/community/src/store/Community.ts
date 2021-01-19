import {types, getEnv} from 'mobx-state-tree';
import {PageStore} from './Page';
import {NavigationalStore} from './navigational'
export const CommunityStore = types
    .model('Community', {
        _id: types.string,
        name: types.string,
        description: types.maybeNull(types.string),
        url: types.maybeNull(types.string),
        active: types.maybeNull(types.boolean),
        pages: types.optional(types.array(PageStore), []),
        navigations: types.optional(types.array(NavigationalStore), [])
    })
    .views(self => ({}))
    .actions(self => ({}));

export type IPageStore = typeof CommunityStore.Type;
