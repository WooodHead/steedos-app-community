import {types, getEnv, applySnapshot, getSnapshot, flow} from 'mobx-state-tree';
import { values } from "mobx"
import {CommunityStore} from './Community';
import {when, reaction, $mobx} from 'mobx';
import { UserInfoStore } from './UserInfo';
import { SteedosClient } from '@steedos/client';
import { PageStore } from './Page';
export const steedosClient = new SteedosClient();
export const MainStore = types
    .model('MainStore', {
        communities: types.optional(types.array(CommunityStore), []),
        userInfo: types.optional(UserInfoStore, {}),
        loginPage: types.optional(PageStore, {}),
        theme: 'default',
        _routerBasename: types.maybeNull(types.string),
        asideFixed: true,
        asideFolded: false,
        offScreen: false,
        addPageIsOpen: false,
        preview: false,
        isMobile: false,
        schema: types.frozen(),
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
        },
        get rootUrl(){
            return getEnv(self).rootUrl();
        },
        get logo() {
            return `${steedosClient.getBaseRoute()}/api/files/images/${values(self.communities)[0]?.logo}`
        },
        get community(){
            //TODO
            return values(self.communities)?.length > 0 ? values(self.communities)[0] : null
        },
        get routerBasename(){
            return values(self.communities)?.length > 0 ? `/${values(self.communities)[0].path}` : self._routerBasename
        },
        get navigations(){
            return values(self.communities)?.length > 0 ? values(self.communities)[0].navigations : null
        },
        getPage(pagePath: string) {
            let page;
            self.communities.forEach(function(value, key){
                page = value.pages.find(function(_page){
                    return _page.path === pagePath
                })
            })
            return page;
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
            self.userInfo = UserInfoStore.create({...data, avatar: `${self.rootUrl}/avatar/${data.userId}`})
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
            saveUserInfo:flow(function* saveUserInfo(userInfo) {
                setUserInfo(userInfo);
            }),
            fetchCommunity: flow(function* fetchCommunity(communityPath) {
                try {
                    const response = yield steedosClient.graphql.query(`
                    {
                        community(filters:"path eq '${communityPath}'"){
                          _id
                          name
                          logo
                          description
                          url
                          path
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
                    `)
                    const community = response.data.community || [];
                    if(community.length > 0){
                        addCommunity(community[0])
                    }
                } catch (error) {
                    // ... including try/catch error handling
                    console.error("Failed to fetch projects", error)
                }
            }),
            fetchUserInfo: flow(function* fetchUserInfo() {
                try {
                    const userInfo = yield steedosClient.getMe();
                    setUserInfo(userInfo);
                } catch (error) {
                    console.error("Failed to fetch projects", error)
                }
            }),
            fetchLoginPage: flow(function* fetchLoginPage(communityPath) {
                try {
                    const loginPage = yield steedosClient.doFetch(`${steedosClient.getBaseRoute()}/api/community/public/${communityPath}/login`, {method: 'GET'})
                    setLoginPage(loginPage);
                } catch (error) {
                    console.error("Failed to fetch projects", error)
                }
            }),
            afterCreate() {
                console.log('afterCreate....', getEnv(self).rootUrl());
                steedosClient.setUrl(getEnv(self).rootUrl());
                if(typeof window !== 'undefined'){
                    try {
                        const communityPath = (window as any).location.href.split("#")[1].split('/')[1];
                        self._routerBasename = communityPath;
                        (window as any).SteedosLogin = function(){
                            steedosClient.login($('#email').val() || $("[name='email']").val(), $('#password').val() || $("[name='password']").val()).then((result: any) => {
                                console.log('result', result);
                                (self as any).saveUserInfo(result.user);
                                window.location.href = `/#/${communityPath}`;;
                            }).catch((err:any) => {
                                console.log('err', err);
                                $('#loginFormErrorInfo').remove();
                                $("form").append(`
                                    <div class="rounded-md bg-red-50 p-4" id='loginFormErrorInfo'>
                                        <div class="flex">
                                        <div class="flex-shrink-0">
                                            <!-- Heroicon name: information-circle -->
                                            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3 flex-1 md:flex md:justify-between">
                                            <p class="text-sm text-blue-700">
                                            账户、密码错误
                                            </p>
                                        </div>
                                        </div>
                                    </div>
                                `)
                            });
                            return false;
                        };

                        (self as any).fetchLoginPage(communityPath);

                        const userId = getCookie('X-User-Id');
                        console.log('userId', userId);
                        if(!userId){
                            console.log('userId is null');
                            // window.location.href = "http://127.0.0.1:8088/accounts/a/#/login?redirect_uri="+ window.location.href;
                             window.location.href = `/community/#/${communityPath}/login`;
                        }else{
                            console.log('userId fetchCommunity');
                            (self as any).fetchUserInfo();
                            (self as any).fetchCommunity(communityPath);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        };
    });

export type IMainStore = typeof MainStore.Type;
