const T = require('../core/treeFragment.js');
const RenderDiff = require('../core/renderDiff.js');

class Table {
    constructor() {
        this.parent = document.getElementById('App');
        this.mData = {
            items: []
        };
    }

    template() {
        return (
            <div class="Main">
                <table class="Table" onclick={(event) => {
                    console.log(event.target.getAttribute("data-text"));
                    return false;
                }}>
                    <tbody>
                        {this.mData.items.map((item) => {
                            return (
                                <tr class={"TableRow " + (item.active
                                    ? 'active'
                                    : '')} data-id={item.id}>
                                    <td class="TableCell" data-text={"#" + item.id}>{"#" + item.id}</td>
                                    {item.props.map((prop) => {
                                        return (
                                            <td class="TableCell" data-text={"#" + prop}>{prop}</td>
                                        )
                                    })
}
                                </tr>
                            )
                        })
}
                    </tbody>
                </table>
            </div>
        )
    }

    render(data) {
        this.mData = data;
        RenderDiff(this.parent, this.template());
    }
}
const renderTable = new Table();

class Anim {
    constructor() {
        this.parent = document.getElementById('App');
        this.mData = {
            items: []
        };
    }

    template() {
        return (
            <div class="Main">
                <div class="Anim">
                    {this.mData.items.map((item) => {
                        return (
                            <div class="AnimBox" style={'border-radius:' + item.time + 'px; background:rgba(0,0,0,' + (0.5 + ((item.time % 10) / 10)) + ');'} data-id={item.id}></div>
                        )
                    })
}
                </div>
            </div>
        )
    }

    render(data) {
        this.mData = data;
        RenderDiff(this.parent, this.template());
    }
}
const renderAnim = new Anim();

class Tree {
    constructor() {
        this.parent = document.getElementById('App');
        this.mData = {
            root: {
                children: []
            }
        };
    }

    renderTreeNode(data) {
        return (
            <ul class="TreeNode">
                {data.children.map((n) => {
                    if (n.container) {
                        return this.renderTreeNode(n);
                    } else {
                        return (
                            <li class="TreeLeaf">{n.id}</li>
                        )
                    }
                })
}
            </ul>
        )
    }

    template() {
        return (
            <div class="Tree">{this.renderTreeNode(this.mData.root)}</div>
        )
    }

    render(data) {
        this.mData = data;
        RenderDiff(this.parent, this.template());
    }
}
const renderTree = new Tree();

function renderMain(data) {
    const location = data && data.location;
    if (location === "table") {
        renderTable.render(data.table);
    } else if (location === "anim") {
        renderAnim.render(data.anim);
    } else if (location === "tree") {
        renderTree.render(data.tree);
    }
}

uibench.init("Vanilla[createElements]", "1.0.0");

var cells;
document.addEventListener("DOMContentLoaded", (e) => {
    const container = document.getElementById("App");
    uibench.run((state) => {
        renderMain(state);
    }, (samples) => {
        document.body.innerHTML = "<pre>" + JSON.stringify(samples, null, " ") + "</pre>";
    });
});
