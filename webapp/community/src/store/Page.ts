import {types, getEnv} from 'mobx-state-tree';
export const PageStore = types
    .model('Page', {
        _id: types.maybeNull(types.string),
        icon: '',
        path: '',
        label: '',
        title: types.maybeNull(types.string),
        schema: types.maybeNull(types.string)
    })
    .views(self => ({}))
    .actions(self => {
        function updateSchema(schema: any) {
            self.schema = schema;
        }

        return {
            updateSchema
        };
    });

export type IPageStore = typeof PageStore.Type;
