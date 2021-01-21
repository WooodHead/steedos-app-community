import {types, getEnv, applySnapshot, getSnapshot, flow} from 'mobx-state-tree';
import {CommunityStore} from './Community';
import {when, reaction} from 'mobx';
import { UserInfoStore } from './UserInfo';
import { SteedosClient } from '@steedos/client';
import { PageStore } from './Page';
export const MainStore = types
    .model('MainStore', {
        communities: types.optional(types.array(CommunityStore), []),
        userInfo: types.optional(UserInfoStore, {}),
        loginPage: types.optional(PageStore, {}),
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
            self.communities.push(data)
        }

        function setUserInfo(data: any) {
            self.userInfo = UserInfoStore.create({...data, avatar: `http://127.0.0.1:8088/avatar/${data.userId}`})
        }

        function setLoginPage(data: any) {
            self.loginPage = PageStore.create({...data})
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

        function getCookie(cname: any){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) 
            {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) return c.substring(name.length,c.length);
            }
            return "";
        }

        return {
            toggleAsideFolded,
            toggleAsideFixed,
            toggleOffScreen,
            setAddPageIsOpen,
            addCommunity,
            updateSchema,
            setPreview,
            setIsMobile,
            saveUserInfo:flow(function* saveUserInfo(userInfo) { // <- note the star, this a generator function!
                setUserInfo(userInfo);
            }),
            fetchCommunity: flow(function* fetchCommunity(id) { // <- note the star, this a generator function!
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
                                  logo
                                  description
                                  url
                                  active
                                  pages:related__community_page{
                                    _id,
                                    name,
                                    path,
                                    title,
                                    schema
                                  },
                                  navigations:related__community_navigation{
                                    _id,
                                    name,
                                    menus: related__community_navigation_menu{
                                        _id,
                                        url,
                                        icon,
                                        type,
                                        name,
                                        page {
                                            _id,
                                            name,
                                            path,
                                            title
                                        },
                                        event,
                                        sort
                                    }
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
            fetchUserInfo: flow(function* fetchUserInfo() { // <- note the star, this a generator function!
                try {
                    // ... yield can be used in async/await style
                    const response = yield getEnv(self).fetcher({
                        url: 'http://127.0.0.1:8088/accounts/user',
                        method: 'get'
                    })
                    const userInfo = response.data;
                    setUserInfo(userInfo);
                } catch (error) {
                    // ... including try/catch error handling
                    console.error("Failed to fetch projects", error)
                }
            }),
            fetchLoginPage: flow(function* fetchLoginPage() { // <- note the star, this a generator function!
                try {
                    // ... yield can be used in async/await style
                    const response = yield getEnv(self).fetcher({
                        url: 'http://127.0.0.1:8088/api/community/public/help/login',
                        method: 'get'
                    })
                    const loginPage = response.data;
                    setLoginPage(loginPage);
                } catch (error) {
                    // ... including try/catch error handling
                    console.error("Failed to fetch projects", error)
                }
            }),
            afterCreate() {
                console.log('afterCreate....');
                if(typeof window !== 'undefined'){

                    (window as any).SteedosClient = new SteedosClient();

                    (window as any).SteedosClient.setUrl('http://127.0.0.1:8088');
                    (window as any).SteedosLogin = function(){
                        (window as any).SteedosClient.login(document.getElementsByName('email')[0].value, document.getElementsByName('password')[0].value).then((result) => {
                            console.log('result', result);
                            (self as any).saveUserInfo(result.user);
                            window.location.href = '/';
                        }).catch((err) => {
                            console.log('err', err);
                        });
                    };

                    (self as any).fetchLoginPage();

                    const userId = getCookie('X-User-Id');

                    if(!userId){
                        // window.location.href = "http://127.0.0.1:8088/accounts/a/#/login?redirect_uri="+ window.location.href;
                        window.location.href = "/#/login";
                    }else{
                        (self as any).fetchUserInfo();
                        applySnapshot(self, {userInfo: UserInfoStore.create({_id: userId, avatar: `http://127.0.0.1:8088/avatar/${userId}`})})
                        const search  = new URLSearchParams(window.location.search);
                        const pageId = search.get('id');
                        (self as any).fetchCommunity(pageId);
                    }
                    

                }
            }
        };
    });

export type IMainStore = typeof MainStore.Type;
