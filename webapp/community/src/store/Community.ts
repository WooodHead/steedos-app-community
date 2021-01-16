import {types, getEnv} from 'mobx-state-tree';
import {PageStore} from './Page';
export const CommunityStore = types
    .model('Community', {
        _id: types.string,
        name: types.string,
        description: types.maybeNull(types.string),
        url: types.maybeNull(types.string),
        active: types.maybeNull(types.boolean),
        related__community_page: types.optional(types.array(PageStore), [])
    })
    .views(self => ({}))
    .actions(self => ({}));

export type IPageStore = typeof CommunityStore.Type;
