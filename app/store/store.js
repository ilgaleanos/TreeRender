const {observable} = mobx;

class Store {
    @observable text = 'Text in distinct classes';
    @observable arr = [];
}
var store = new Store();

module.exports = store;
