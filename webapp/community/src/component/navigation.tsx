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
                    <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-gray-800 md:text-3xl">
                            <a href="#">Steedos</a>
                    </div>
                        <div className="md:hidden">
                            <button type="button" className="block text-gray-800 hover:text-gray-700 focus:text-gray-700 focus:outline-none">
                                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                                    <path className="hidden" d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"/>
                                    <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row hidden md:block -mx-2">
                        {(this.props as any).navigations[0].menus.map((element: any) => (
                            <a key={element._id} href="javascript:void(0)" onClick={e => this.clickMenu(element)} className="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">{element.name}</a>
                        ))}
                    </div>
                </div>
            </nav>
        )
    }
}
export default Navigation