import React from 'react';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, HashRouter as Router} from 'react-router-dom';
import {observer} from 'mobx-react';
import {IMainStore} from '../store';


import '../renderer/MyRenderer';
import '../renderer/SteedosObjectCRUDRenderer';
import LayoutInRouter from './layout';

const Page = React.lazy(() => import('./page'));
const LoginPage = React.lazy(() => import('./loginPage'));
const basename='/help'
export default observer(function({store}: {store: IMainStore}) {
    let redirectTo = '';
    store.communities.forEach(function(value, key){
        console.log('value', value.pages[0]);
        redirectTo = value.pages[0].path
    })
    console.log('redirectTo', redirectTo);
    return (
        <Router basename={basename}>
            <div className="routes-wrapper">
                <ToastComponent key="toast" position={'top-right'} theme={store.theme} />
                <AlertComponent key="alert" theme={store.theme} />
                <React.Suspense fallback={<Spinner overlay className="m-t-lg" size="lg" />}>
                    <Switch>
                        {
                        redirectTo && <Redirect to={`/${redirectTo}`} from={'/'} exact />
                        }
                        <Route path={`/login`} component={LoginPage} />
                        <LayoutInRouter path="/:id" component={Page} props={{store: store}}/>
                    </Switch>
                </React.Suspense>
            </div>
        </Router>
    );
});
