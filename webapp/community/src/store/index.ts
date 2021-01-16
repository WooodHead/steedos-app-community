import {types, getEnv, applySnapshot, getSnapshot, flow} from 'mobx-state-tree';
import {CommunityStore} from './Community';
import {when, reaction} from 'mobx';
export const MainStore = types
    .model('MainStore', {
        communities: types.optional(types.array(CommunityStore), []),
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

        function addCommunity(data: any) {
            console.log('addCommunity', data);
            self.communities.push(data)
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
            addCommunity,
            updatePageSchemaAt: flow(function* updatePageSchemaAt(id) { // <- note the star, this a generator function!
                try {
                    let _id = 'YsSAi43ZHEJs5L79i';
                    // ... yield can be used in async/await style
                    const response = yield getEnv(self).fetcher({
                        url: 'http://127.0.0.1:8088/graphql',
                        method: 'post',
                        data: {
                            query: `
                            {
                                community(filters:"_id eq ${_id}"){
                                  _id
                                  name
                                  description
                                  url
                                  active
                                  related__community_page{
                                    name,
                                    url,
                                    title,
                                    schema
                                  },
                                  related__community_navigational{
                                    name
                                  }
                                }
                              }
                            `
                        }
                    })
                    const community = response.data.community || [];
                    if(community.length > 0){
                        addCommunity(community[0])
                    }
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
                    let _id = 'YsSAi43ZHEJs5L79i';
                    // ... yield can be used in async/await style
                    const response = yield getEnv(self).fetcher({
                        url: 'http://127.0.0.1:8088/graphql',
                        method: 'post',
                        data: {
                            query: `
                            {
                                community(filters:"_id eq ${_id}"){
                                  _id
                                  name
                                  description
                                  url
                                  active
                                  related__community_page{
                                    _id,
                                    name,
                                    path,
                                    title,
                                    schema
                                  },
                                  related__community_navigational{
                                    name
                                  }
                                }
                              }
                            `
                        }
                    })
                    const community = response.data.data.community || [];
                    if(community.length > 0){
                        addCommunity(community[0])
                    }
                } catch (error) {
                    // ... including try/catch error handling
                    console.error("Failed to fetch projects", error)
                }
            }),
            afterCreate() {
                console.log('afterCreate....');
                if(typeof window !== 'undefined'){
                    const search  = new URLSearchParams(window.location.search);
                    const pageId = search.get('id');
                    (self as any).fetchPage(pageId)
                }
            }
        };
    });

export type IMainStore = typeof MainStore.Type;
