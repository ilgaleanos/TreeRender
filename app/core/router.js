/*
* @author ilgaleanos under licence MIT
*
* It require routes starting and ending with  /
* routes is a dic the routes of the form { routeString: handlerClass }
* store is a globar object to pass data to handlerClasses
* if you need calls to parents, you must implement inheritance
* rDefault is the first route to go at end compile routes
* based on https://en.wikipedia.org/wiki/Depth-first_search
* and Radix tree (https://en.wikipedia.org/wiki/Radix_tree)
*
*/

class Router {
    constructor(dicRoutes = {}, objStore = {}, rDefault = "/") {
        var self = this;

        // listener for routes change
        History.Adapter.bind(window, 'statechange', () => {
            self.beforeChange();
            self.mGoToLink(History.getState().hash);
            self.afterChange();
        });

        this.rDefault = rDefault;
        this.dicRoutes = dicRoutes;
        this.routesKeys = Object.keys(this.dicRoutes);
        this.numOfRoutes = this.routesKeys.length;
        objStore.onCurrentRoute = '';

        // this object is pass to all clases
        this.mData = {
            store: objStore,
            params: {},
            query: {}
        }

        this.fn;
        this.notFoundBool = false;
        this.routesCompile();
    }

    beforeChange() {}
    afterChange() {}

    /**
    * Set a specific not found handler, in othercase is '/' handler
    *
    */
    setNotFound(aFunction) {
        this.notFound = aFunction;
        this.notFoundBool = true;
    }

    /**
    * Handler for find a route
    *
    */
    mGoToLink(mLinkStr) {
        // split the route to find
        var rSplit = mLinkStr.split('/');

        // delete the first void string
        if (rSplit[0] == "") {
            rSplit.splice(0, 1);
        }

        // flag to access to save this.fn in recursive returns
        this.access = true;

        // clear previous data
        this.mData.params = {};
        this.mData.query = {};

        // verify if route has search query
        const lenrSplit = rSplit.length - 1;
        if (rSplit[lenrSplit][0] == "?") {
            this.mGetSearch(rSplit[lenrSplit]);
            rSplit[lenrSplit] = "";
        }

        // call the worker to get this.fn
        this.mGetFnOfRoute(this.routeTree, rSplit, 0);

        // if this.fn is undefined was by route not found
        if (this.fn === undefined) {
            if (this.notFoundBool) {
                this.mData.store.onCurrentRoute = this.notFound.toString().split('(')[0].split(' ')[1];
                new this.notFound(this.mData).render();
            } else {
                this.mData.store.onCurrentRoute = this.dicRoutes[this.rDefault].toString().split('(')[0].split(' ')[1];
                new this.dicRoutes[this.rDefault](this.mData).render();
            }
        } else {
            this.mData.store.onCurrentRoute = this.fn.toString().split('(')[0].split(' ')[1];
            new this.fn(this.mData).render();
        }
    }

    // search in depth for the route in this.routeTree,
    // return a handler or undefined
    mGetFnOfRoute(obj, arrRoute, depth) {
        var part = arrRoute[depth];

        if (obj[part] === undefined) {
            var arrKeys = Object.keys(obj),
                key;
            for (var i = 0, k = arrKeys.length; i < k; i++) {
                key = arrKeys[i];
                if (key[0] == ':') {
                    this.mData.params[key.substring(1)] = part;
                    // Recursively
                    this.mGetFnOfRoute(obj[key], arrRoute, depth + 1);
                }
            }

            // flags for recursive returns
            if (this.access && part === "") {
                this.fn = obj['>fn'];
                this.access = false;
            } else if (this.access) {
                this.fn = undefined;
                this.access = false;
            }
            return;
        }
        // Recursively
        this.mGetFnOfRoute(obj[part], arrRoute, depth + 1);
    }

    /**
    * handler for a query params worker of mGoToLink
    *
    */
    mGetSearch(searchStr) {
        if (searchStr) {
            searchStr = searchStr.substring(1);
            var arrElem,
                arrParts = searchStr.split('&');
            for (var i = 0, k = arrParts.length; i < k; i++) {
                arrElem = arrParts[i].split('=');
                this.mData.query[arrElem[0]] = arrElem[1];
            }
        }
    }

    /**
    * Handler for compile routes in a deep tree
    *
    */
    routesCompile() {
        this.routeTree = {};
        var rSplit,
            part;
        for (var i = 0; i < this.numOfRoutes; i++) {
            rSplit = this.routesKeys[i].split('/');
            rSplit.splice(0, 1);
            this.mSetNode(this.routeTree, rSplit[0], rSplit, 0, this.dicRoutes[this.routesKeys[i]])
        }
    }

    /**
    * recursive worker for routesCompiler set a node and '>fn' for handlers
    *
    */
    mSetNode(obj, part, arrRoute, depth, fn) {
        var newDepth = depth + 1;
        if (obj[part] === undefined) {
            obj[part] = {};
        }
        if (arrRoute[newDepth] === undefined || arrRoute[newDepth] === "" || arrRoute[newDepth][0] === '?') {
            obj[part] = {
                '>fn': fn
            };
            return;
        }
        this.mSetNode(obj[part], arrRoute[newDepth], arrRoute, newDepth, fn);
    }

    /* *
    * function to start router, execute after configure
    *
    */
    start() {
        this.mGoToLink(History.getState().hash);
    }

}

module.exports = Router;
