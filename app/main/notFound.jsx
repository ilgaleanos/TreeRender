const T = require('../core/treeFragment.js');
const RenderDiff = require('../core/renderDiff.js');
const Layout = require('./layout.jsx')

class notFound extends Layout {
    constructor(props) {
        super(props);
        this.containerNotFound = document.getElementById('content');
    }

    templateNotFound() {
        return (
            <div>
                <h2>NOT FOUND</h2>
            </div>
        )
    }

    render() {
        RenderDiff(this.containerNotFound, this.templateNotFound(), "notFound", this.store);
    }
}

module.exports = notFound;
