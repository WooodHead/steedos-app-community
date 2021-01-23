import {types, getEnv} from 'mobx-state-tree';
import {PageStore} from './Page';
export const NavigationalMenuStore = types
    .model('NavigationalMenu', {
        _id: types.identifier,
        name: '',
        sort: types.number,
        icon: types.maybeNull(types.string), 
        url: types.maybeNull(types.string),
        type: types.maybeNull(types.string),
        page: types.maybeNull(PageStore),
        event: types.maybeNull(types.string)
    })
    .views(self => ({}))
    .actions(self => ({
        click: (history: any)=>{
            const menu: any = self;
            const rootUrl = getEnv(self).rootUrl();
            // const {history} = (this.props as any);
            console.log('navigation===', menu.type, menu)
            switch (menu.type) {
                case 'InternalLink':
                    history.push({
                        pathname: menu.page.path,
                    })
                    break;
                case 'Event':
                    switch (menu.event) {
                        case 'Login':
                            window.location.href = `${rootUrl}/accounts/a/#/login?redirect_uri=`+ window.location.href;
                            break;
                        case 'Logout':
                            window.location.href = `${rootUrl}/accounts/a/#/login?redirect_uri=`+ window.location.href;
                            break;
                        default:
                            break;
                    }
                    break;
                case 'ExternalLink':
                    window.open(menu.url);
                    break;
                case 'GlobalAction':
                    break;
                case 'MenuLabel':
                    break;
                case 'NavigationalTopic':
                    break;
                case 'SteedosObject':
                    break;
                case 'SystemLink':
                    break;
                default:
                    break;
            }
        }
    }))

export type INavigationalMenuStore = typeof NavigationalMenuStore.Type;
