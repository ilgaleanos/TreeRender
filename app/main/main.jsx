const Router = require('../core/router.js');
const store = require('../store/store.js')

const notFound = require('./notFound.jsx');
const Home = require('./home.jsx');
const Books = require('./books.jsx');

var routes = {
    '/': Home,
    '/home/': Home,
    '/books/:author/demo/:id/': Books,
    '/foo/': notFound
}

const router = new Router(routes, store);
router.setNotFound(notFound);
router.start();
