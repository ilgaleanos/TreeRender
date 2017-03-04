const T = require('../core/treeFragment.js');
const RenderDiff = require('../core/renderDiff.js');
const Layout = require('./layout.jsx')

class Books extends Layout {
    constructor(props) {
        super(props);
        this.props = props;
        this.containerBooks = document.getElementById('content');
    }

    templateBooks() {
        return (
            <div>
                <p>
                    {"Book author: " + this.props.params.author}</p>
                <p>
                    {"Book id: " + this.props.params.id}</p>
                <p>
                    {"foo: " + this.props.query.foo}</p>
                <p>
                    {"bar: " + this.props.query.bar}</p>
            </div>
        )
    }

    render() {
        RenderDiff(this.containerBooks, this.templateBooks(), "Books", this.store);
    }
}

module.exports = Books;
