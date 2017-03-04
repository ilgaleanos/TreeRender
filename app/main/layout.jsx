const {autorun} = mobx;

const T = require('../core/treeFragment.js');
const RenderDiff = require('../core/renderDiff.js');

class Layout {
    constructor(props) {
        this.containerLayout = document.getElementById('root');
        this.store = props.store;
        this.renderLayout();
    }

    templateLayout() {
        return (
            <div>
                <ul>
                    <li>
                        <a href="/">index</a>
                    </li>
                    <li>
                        <a href="/home/">/home/</a>
                    </li>
                    <li>
                        <a href="/books/isaac/demo/15/?foo=3&bar=5">/books/</a>
                    </li>
                    <li>
                        <a href="/notFound/foo/">404</a>
                    </li>
                </ul>
                <h1>{this.store.text}</h1>
                <container id="content"></container>
            </div>
        )
    }

    // render without blocking
    renderLayout() {
        autorun(() => {
            RenderDiff(this.containerLayout, this.templateLayout());
        });
    }

}

module.exports = Layout;
