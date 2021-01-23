import {types, getEnv, applySnapshot, getSnapshot, flow} from 'mobx-state-tree';
import {PageStore} from './Page';
import {when, reaction} from 'mobx';
export const MainStore = types
    .model('MainStore', {
        pages: types.optional(types.map(PageStore), {}),
        theme: 'default',
        asideFixed: true,
        asideFolded: false,
        offScreen: false,
        addPageIsOpen: false,
        preview: false,
        isMobile: false,
        schema: types.frozen()
    })
    .views(self => ({
        get fetcher() {
            return getEnv(self).fetcher;
        },
        get notify() {
            return getEnv(self).notify;
        },
        get alert() {
            return getEnv(self).alert;
        },
        get copy() {
            return getEnv(self).copy;
        }
    }))
    .actions(self => {
        function toggleAsideFolded() {
            self.asideFolded = !self.asideFolded;
        }

        function toggleAsideFixed() {
            self.asideFixed = !self.asideFixed;
        }

        function toggleOffScreen() {
            self.offScreen = !self.offScreen;
        }

        function setAddPageIsOpen(isOpened: boolean) {
            self.addPageIsOpen = isOpened;
        }

        function addPage(data: {id: string, label: string; path: string; icon?: string; schema?: any}) {
            self.pages.set(data.id, PageStore.create({
                ...data
            }))
        }

        function removePageAt(id: string) {
            // self.pages.splice(index, 1);
            self.pages.delete(id)
        }

        function updatePageSchemaAt(index: number) {
            // self.pages[index].updateSchema(self.schema);
            console.log('self.pages[index]', self.schema);
        }

        function updateSchema(value: any) {
            self.schema = value;
        }

        function setPreview(value: boolean) {
            self.preview = value;
        }

        function setIsMobile(value: boolean) {
            self.isMobile = value;
        }
        return {
            toggleAsideFolded,
            toggleAsideFixed,
            toggleOffScreen,
            setAddPageIsOpen,
            addPage,
            removePageAt,
            updatePageSchemaAt: flow(function* updatePageSchemaAt(id) { // <- note the star, this a generator function!
                try {
                    // ... yield can be used in async/await style
                    const response = yield getEnv(self).fetcher({
                        url: `${getEnv(self).rootUrl()}/api/v4/community_page/${id}`,
                        method: 'put',
                        data: {
                            $set: {
                                schema: JSON.stringify(self.schema)
                            }
                        }
                    })

                    const page = response.data;
                    addPage({
                        icon: "",
                        id: id,
                        path: page.url,
                        label: page.label,
                        schema: {
                            type: 'page',
                            title: page.title,
                            body: '这是你刚刚新增的页面' + id
                        }
                    })
                } catch (error) {
                    // ... including try/catch error handling
                    console.error("Failed to fetch projects", error)
                }
            }),
            updateSchema,
            setPreview,
            setIsMobile,
            fetchPage: flow(function* fetchPage(id) { // <- note the star, this a generator function!
                try {
                    // ... yield can be used in async/await style
                    const response = yield getEnv(self).fetcher({
                        url: `${getEnv(self).rootUrl()}/api/v4/community_page/${id}`,
                        method: 'get'
                    })

                    const page = response.data;

                    let schema = {
                        type: 'page',
                        title: page.title,
                        body: '这是你刚刚新增的页面'
                    }

                    if(page.schema){
                        try {
                            schema = JSON.parse(page.schema)
                        } catch (error) {
                            console.error(error)
                        }
                    }

                    addPage({
                        icon: "",
                        id: id,
                        path: page.url,
                        label: page.label,
                        schema: schema
                    })
                } catch (error) {
                    // ... including try/catch error handling
                    console.error("Failed to fetch projects", error)
                }
            }),
            afterCreate() {
                console.log('afterCreate....');
                // // persist store
                // if (typeof window !== 'undefined' && window.localStorage) {
                //     const storeData = window.localStorage.getItem('store');
                //     if (storeData) applySnapshot(self, JSON.parse(storeData));

                //     reaction(
                //         () => getSnapshot(self),
                //         json => {
                //             window.localStorage.setItem('store', JSON.stringify(json));
                //         }
                //     );
                // }
                // console.log('fetchPage', )
                if(typeof window !== 'undefined'){
                    const search  = new URLSearchParams(window.location.search);
                    const pageId = search.get('id');
                    (self as any).fetchPage(pageId)
                }
            }
        };
    });

export type IMainStore = typeof MainStore.Type;
