import React from 'react';
import {observer, inject} from 'mobx-react';
import {IMainStore} from '../store';
import {Button, AsideNav, Layout, confirm} from 'amis';
import {RouteComponentProps, matchPath, Switch, Route} from 'react-router';
import {Link} from 'react-router-dom';
import NotFound from './NotFound';
import AMISRenderer from '../component/AMISRenderer';
import AddPageModal from '../component/AddPageModal';

function isActive(link: any, location: any) {
    const ret = matchPath(location.pathname, {
        path: link ? link.replace(/\?.*$/, '') : '',
        exact: true,
        strict: true
    });

    return !!ret;
}

export default inject('store')(
    observer(function ({store, location, history}: {store: IMainStore} & RouteComponentProps) {
        function renderHeader() {
            return (
                <div>
                    <div className={`a-Layout-brandBar`}>
                        <button onClick={store.toggleOffScreen} className="pull-right visible-xs">
                            <i className="glyphicon glyphicon-align-justify"></i>
                        </button>
                        <div className={`a-Layout-brand`}>
                            <span className="hidden-folded m-l-sm">community 编辑器</span>
                        </div>
                    </div>
                    {/* <div className={`a-Layout-headerBar`}>
                        <div className="hidden-xs p-t-sm pull-right">
                            <Button size="sm" className="m-r-xs" level="success" disabled disabledTip="Todo...">
                                全部导出
                            </Button>
                            <Button size="sm" level="info" onClick={() => store.setAddPageIsOpen(true)}>
                                新增页面
                            </Button>
                        </div>
                    </div> */}
                </div>
            );
        }

        function renderAside() {
            let navigations: Array<any> = []
            store.pages.forEach(item => (
                navigations.push({
                    label: item.label,
                    path: `/${item.path}`,
                    icon: item.icon,
                    pageId: item.id
                })));
            console.log('navigations', navigations);
            const paths = navigations.map(item => item.path);

            return (
                <AsideNav
                    key={store.asideFolded ? 'folded-aside' : 'aside'}
                    navigations={[
                        {
                            label: '导航',
                            children: navigations
                        }
                    ]}
                    renderLink={({link, toggleExpand, classnames: cx, depth}: any) => {
                        if (link.hidden) {
                            return null;
                        }

                        let children = [];

                        if (link.children) {
                            children.push(
                                <span
                                    key="expand-toggle"
                                    className={cx('AsideNav-itemArrow')}
                                    onClick={e => toggleExpand(link, e)}
                                ></span>
                            );
                        }

                        link.badge &&
                            children.push(
                                <b key="badge" className={cx(`AsideNav-itemBadge`, link.badgeClassName || 'bg-info')}>
                                    {link.badge}
                                </b>
                            );

                        if (link.icon) {
                            children.push(<i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />);
                        } else if (store.asideFolded && depth === 1) {
                            children.push(
                                <i
                                    key="icon"
                                    className={cx(`AsideNav-itemIcon`, link.children ? 'fa fa-folder' : 'fa fa-info')}
                                />
                            );
                        }

                        link.active ||
                            children.push(
                                <i
                                    key="delete"
                                    data-tooltip="删除"
                                    data-position="bottom"
                                    className={'navbtn fa fa-times'}
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        confirm('确认要删除').then(confirmed => {
                                            confirmed && store.removePageAt(link.pageId);
                                        });
                                    }}
                                />
                            );

                        children.push(
                            <i
                                key="edit"
                                data-tooltip="编辑"
                                data-position="bottom"
                                className={'navbtn fa fa-pencil'}
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    history.push(`/edit/${link.pageId}`);
                                }}
                            />
                        );

                        children.push(
                            <span key="label" className={cx('AsideNav-itemLabel')}>
                                {link.label}
                            </span>
                        );

                        return link.path ? (
                            link.active ? (
                                <a>{children}</a>
                            ) : (
                                <Link to={link.path[0] === '/' ? link.path : `${link.path}`}>{children}</Link>
                            )
                        ) : (
                            <a
                                onClick={
                                    link.onClick ? link.onClick : link.children ? () => toggleExpand(link) : undefined
                                }
                            >
                                {children}
                            </a>
                        );
                    }}
                    isActive={(link: any) =>
                        isActive(link.path && link.path[0] === '/' ? link.path : `${link.path}`, location)
                    }
                />
            );
        }

        function handleConfirm(value: {label: string; icon: string; path: string}) {
            console.log('TODO odata create...');
            // store.addPage({
            //     ...value,
            //     schema: {
            //         type: 'page',
            //         title: value.label,
            //         body: '这是你刚刚新增的页面。'
            //     }
            // });
            store.setAddPageIsOpen(false);
        }

        function getPages() {
            let pages: Array<any> = [];
            store.pages.forEach(item => (
                pages.push(item)
            ));
            return pages;
        }

        return (
            <Layout
                aside={renderAside()}
                header={renderHeader()}
                folded={store.asideFolded}
                offScreen={store.offScreen}
            >
                <Switch>
                    {getPages().map(item => (
                        <Route
                            key={item.id}
                            path={`/${item.path}`}
                            render={() => <AMISRenderer schema={item.schema} />}
                        />
                    ))}
                    <Route component={NotFound} />
                </Switch>
                {/* <AddPageModal
                    show={store.addPageIsOpen}
                    onClose={() => store.setAddPageIsOpen(false)}
                    onConfirm={handleConfirm}
                    pages={getPages()}
                /> */}
            </Layout>
        );
    })
);
