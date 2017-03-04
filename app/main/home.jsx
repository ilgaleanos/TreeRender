const {autorun, runInAction} = mobx;

const T = require('../core/treeFragment.js');
const Palette = require('../core/palette.js');
const RenderDiff = require('../core/renderDiff.js');
const Layout = require('./layout.jsx')
const Part = require('./part.jsx')

class Home extends Layout {
    constructor(props) {
        super(props);
        this.containerHome = document.getElementById('content');
        this.mData = {
            items: [
                {
                    id: 1,
                    active: false,
                    props: [1, 2, 3]
                }, {
                    id: 2,
                    active: true,
                    props: [11, 12, 13]
                }, {
                    id: 3,
                    active: false,
                    props: [21, 22, 23]
                }, {
                    id: 4,
                    active: true,
                    props: [31, 32, 33]
                }
            ]
        };

        var mPalette = new Palette({
            '.Table': {
                color: 'blue'
            }
        })
        setTimeout(() => {
            this.mData = {
                items: [
                    {
                        id: 10,
                        active: false,
                        props: [1, 2, 3]
                    }, {
                        id: 20,
                        active: false,
                        props: [1, 2, 3]
                    }, {
                        id: 30,
                        active: true,
                        props: [1, 2, 3]
                    }, {
                        id: 40,
                        active: true,
                        props: [1, 2, 3]
                    }
                ]
            };
            mPalette.render({
                '.Table': {
                    color: 'brown'
                }
            })
            this.store.text = "" + Math.random();
        }, 2000)

        this.store.arr = [];
    }

    changeInput(event) {
        runInAction(() => {
            this.store.text = event.target.value;
            this.store.arr = [];
            for (var i = 0; i < this.store.text.length; i++) {
                this.store.arr.push(i)
            }
        })
    }

    templateHome() {
        return (
            <div>
                <h2>{this.store.text}</h2>
                <div>
                    {this.store.arr.map((el) => {
                        return (
                            <div>{this.store.text}</div>
                        )
                    })
}
                </div>
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
                                    <td>
                                        {this.store.arr.map((el) => {
                                            return (
                                                <div>{this.store.text}</div>
                                            )
                                        })
}
                                    </td>
                                </tr>
                            )
                        })
}
                    </tbody>
                </table>
                <div>{this.store.text}</div>
                <p>
                    {this.store.arr.map((el) => {
                        return (
                            <div>{this.store.text}</div>
                        )
                    })
}
                </p>
                <div>
                    <input onkeyup={this.changeInput.bind(this)} value={this.store.text}/> {Part(this.store.arr)
}
                </div>
            </div>
        )
    }

    // render with blocking
    render() {
        autorun(() => {
            RenderDiff(this.containerHome, this.templateHome(), "Home", this.store);
        });
    }
}

module.exports = Home;
