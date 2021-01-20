import React from 'react';
import PropTypes from 'prop-types';
import {RouteComponentProps, matchPath, Switch, Route} from 'react-router';

class Navigation extends React.Component {
    static propTypes = {
        navigations: PropTypes.any,
        history: PropTypes.any
    }

    clickMenu = (menu: any)=>{
        const {history} = (this.props as any);
        console.log('navigation===', menu.type, menu)
        switch (menu.type) {
            case 'InternalLink':
                history.push({
                    pathname: menu.page.path,
                })
                break;
            case 'Event':
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
    
    render() {
        console.log("this.props", this.props);
        return (
            <nav className="bg-white shadow-lg">
                <div className="md:flex items-center justify-between py-2 px-8 md:px-12">
                    <div className="flex flex-col md:flex-row hidden md:block -mx-2">
                        {(this.props as any).navigations[0].menus.concat().sort(function(a:any,b:any){return a.sort - b.sort;}).map((element: any) => (
                            <a key={element._id} href="javascript:void(0)" onClick={e => this.clickMenu(element)} className="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">{element.name}</a>
                        ))}
                    </div>
                </div>
            </nav>
        )
    }
}
export default Navigation