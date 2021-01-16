import React from 'react';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, HashRouter as Router} from 'react-router-dom';
import {observer} from 'mobx-react';
import {IMainStore} from '../store';

const Preview = React.lazy(() => import('./Preview'));
const Editor = React.lazy(() => import('./Editor'));

export default observer(function({store}: {store: IMainStore}) {
    let redirectTo = '';
    if(store.pages.length > 0){
        redirectTo = store.pages[0].path
    }
    console.log('redirectTo', redirectTo);
    return (
        <Router>
            <div className="routes-wrapper">
                <ToastComponent key="toast" position={'top-right'} theme={store.theme} />
                <AlertComponent key="alert" theme={store.theme} />
                <React.Suspense fallback={<Spinner overlay className="m-t-lg" size="lg" />}>
                    <Switch>
                        {
                        redirectTo && <Redirect to={`/${redirectTo}`} from={`/`} exact />
                        }
                        <Route path="/edit/:id" component={Editor} />
                        <Route component={Preview} />
                    </Switch>
                </React.Suspense>
            </div>
        </Router>
    );
});
