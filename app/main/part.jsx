const { autorun } = mobx;

const T = require('../core/treeFragment.js');
const RenderDiff = require('../core/renderDiff.js');


const Part = function(array = []) {
        return (
                <div>
                        {
                                array.map(( item )=>{return(
                                        <p>soy el item {item} </p>
                                )})
                        }
                </div>
        )
}

module.exports = Part;
