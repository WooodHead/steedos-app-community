const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('underscore');
const defalut = {
    community_navigation: {
        name: "Default Navigation",
        is_default: true
    },
    community_navigation_menu: {
        home: {
            "name": "home",
            "type": "InternalLink",
            "sort": 1
        }
    },
    community_page: {
        home: {
            "name": "home",
            "path": "home",
            "label": "首页",
            "access": "Public",
            "title": "Home",
            "schema": "{}"
        },
        login: {
            "name": "login",
            "path": "login",
            "label": "默认登录页面",
            "access": "Public",
            "title": "Login",
            "schema": "{\"type\":\"page\",\"title\":\"\",\"body\":[{\"type\":\"tpl\",\"tpl\":\"\\n<div class=\\\"min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8\\\">\\n  <div class=\\\"max-w-md w-full space-y-8\\\">\\n    <div>\\n        <img class=\\\"h-12 w-auto\\\" src=\\\"http://127.0.0.1:8088/images/logo_platform.png\\\" alt=\\\"Workflow\\\">\\n        <h2 class=\\\"mt-6 text-3xl font-extrabold text-gray-900\\\">\\n          Sign in to your account\\n        </h2>\\n      </div>\\n    <form class=\\\"mt-8 space-y-6\\\" action=\\\"#\\\" method=\\\"POST\\\" onsubmit=\\\"return SteedosLogin()\\\">\\n      <input type=\\\"hidden\\\" name=\\\"remember\\\" value=\\\"true\\\">\\n      <div class=\\\"rounded-md shadow-sm -space-y-px\\\">\\n        <div>\\n          <label for=\\\"email-address\\\" class=\\\"sr-only\\\">Email address</label>\\n          <input id=\\\"email-address\\\" name=\\\"email\\\" type=\\\"input\\\" autocomplete=\\\"email\\\" required class=\\\"appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm\\\" placeholder=\\\"Email address\\\">\\n        </div>\\n        <div>\\n          <label for=\\\"password\\\" class=\\\"sr-only\\\">Password</label>\\n          <input id=\\\"password\\\" name=\\\"password\\\" type=\\\"password\\\" autocomplete=\\\"current-password\\\" required class=\\\"appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm\\\" placeholder=\\\"Password\\\">\\n        </div>\\n      </div>\\n\\n      <div class=\\\"flex items-center justify-between\\\">\\n        <div class=\\\"flex items-center\\\">\\n          <input id=\\\"remember_me\\\" name=\\\"remember_me\\\" type=\\\"checkbox\\\" class=\\\"h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded\\\">\\n          <label for=\\\"remember_me\\\" class=\\\"ml-2 block text-sm text-gray-900\\\">\\n            Remember me\\n          </label>\\n        </div>\\n\\n        <div class=\\\"text-sm\\\">\\n          <a href=\\\"#\\\" class=\\\"font-medium text-indigo-600 hover:text-indigo-500\\\">\\n            Forgot your password?\\n          </a>\\n        </div>\\n      </div>\\n\\n      <div>\\n        <button type=\\\"submit\\\" class=\\\"group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500\\\">\\n          <span class=\\\"absolute left-0 inset-y-0 flex items-center pl-3\\\">\\n            <!-- Heroicon name: lock-closed -->\\n            <svg class=\\\"h-5 w-5 text-indigo-500 group-hover:text-indigo-400\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" viewBox=\\\"0 0 20 20\\\" fill=\\\"currentColor\\\" aria-hidden=\\\"true\\\">\\n              <path fill-rule=\\\"evenodd\\\" d=\\\"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z\\\" clip-rule=\\\"evenodd\\\" />\\n            </svg>\\n          </span>\\n          Sign in\\n        </button>\\n      </div>\\n    </form>\\n  </div>\\n</div>\\n\",\"inline\":false,\"className\":\"\"}],\"messages\":{},\"className\":\"m-none\",\"bodyClassName\":\"m-none p-none\"}",
        }
    }
}


module.exports = {
    listenTo: 'community',
    afterInsert: async function(){
        const community = this.doc;
        const spaceId = this.spaceId;
        const userSession = await auth.getSessionByUserId(this.userId, this.spaceId);
        const defaultNavigation = await objectql.getObject('community_navigation').insert(Object.assign({community: community._id}, defalut.community_navigation, {space: spaceId}), userSession);
        const defaultHomePage = await objectql.getObject('community_page').insert(Object.assign({community: community._id}, defalut.community_page.home, {space: spaceId}), userSession);
        await objectql.getObject('community_page').insert(Object.assign({community: community._id}, defalut.community_page.login, {space: spaceId}), userSession);
        await objectql.getObject('community_navigation_menu').insert(Object.assign({navigation: defaultNavigation._id, page: defaultHomePage._id}, defalut.community_navigation_menu.home, {space: spaceId}), userSession);
    }
}