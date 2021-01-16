import {types, getEnv} from 'mobx-state-tree';
export const PageStore = types
    .model('Page', {
        _id: types.identifier,
        icon: '',
        path: '',
        label: '',
        schema: types.string
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
