import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './navigation';
import { Transition } from '@headlessui/react'

class Layout extends React.Component {

    static propTypes = {
        navigations: PropTypes.any,
        history: PropTypes.any,
        logo: PropTypes.string,
        userInfo: PropTypes.any
    }

    state = {
        isOpen: false
    }

    setIsOpen = (isOpen: boolean)=>{
        this.setState({ isOpen: isOpen });
    }

    clickMenu = (menu: any)=>{
        const {history} = (this.props as any);
        menu.click(history);
    }
    render() {
        const { isOpen } = this.state
        const { logo, userInfo, navigations } = this.props as any
        return (
            <div>
                { navigations && 
                <div className="h-screen flex overflow-hidden bg-white">
                    <Transition show={isOpen}>
                    <div className="md:hidden">
                        <div className="fixed inset-0 flex z-40">
                        <Transition show={isOpen}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            className="fixed inset-0"
                        >
                            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                        </Transition>
                        <Transition show={isOpen}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                            className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
                        >
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button onClick={() => this.setIsOpen(!isOpen)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Close sidebar</span>

                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <div className="flex-shrink-0 flex items-center px-4">
                                        <img className="h-8 w-auto" src={logo} />
                                    </div>
                                    <nav className="mt-5 px-2 space-y-1">

                                    {(this.props as any).navigations[0].menus.concat().sort(function(a:any,b:any){return a.sort - b.sort;}).map((element: any) => (
                                        <a key={element._id} href="javascript:void(0)" onClick={e => this.clickMenu(element)} className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                                            {element.icon && <div className="text-gray-500 mr-3 h-6 w-6" dangerouslySetInnerHTML={{__html: element.icon}} />}
                                            {element.name}
                                        </a>
                                    ))}
                                    </nav>
                                </div>
                                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                    <a href="javascript:void(0)" className="flex-shrink-0 group block">
                                        <div className="flex items-center">
                                            <div>
                                                <img className="inline-block h-10 w-10 rounded-full" src={userInfo.avatar} />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                                                    {userInfo.name}
                                                </p>
                                                <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                                                    View profile
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                           
                            </Transition>
                            <div className="flex-shrink-0 w-14">

                            </div>
                            
                        </div>
                    </div>
                    </Transition>

                    <div className="hidden md:flex md:flex-shrink-0">
                        <div className="flex flex-col w-64">

                            <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
                                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                                    <div className="flex items-center flex-shrink-0 px-4">
                                        <img className="h-8 w-auto" src={logo} />
                                    </div>
                                    <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                                        {(this.props as any).navigations[0].menus.concat().sort(function(a:any,b:any){return a.sort - b.sort;}).map((element: any) => (
                                            <a key={element._id} href="javascript:void(0)" onClick={e => this.clickMenu(element)} className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                                {element.icon && <div className="text-gray-500 mr-3 h-6 w-6" dangerouslySetInnerHTML={{__html: element.icon}} />}
                                                {element.name}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                    <a href="#" className="flex-shrink-0 w-full group block">
                                        <div className="flex items-center">
                                            <div>
                                                <img className="inline-block h-9 w-9 rounded-full" src={userInfo.avatar} />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                    {userInfo.name}
                                                </p>
                                                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                                                    View profile
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-0 flex-1 overflow-hidden">
                        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                            <button onClick={() => this.setIsOpen(!isOpen)} className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex={0}>
                            {this.props.children}
                        </main>
                    </div>
                </div>
                }
            </div>
        )
    }
}
export default Layout