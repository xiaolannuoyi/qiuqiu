//数据信息存入数据库

const mongoose = require('mongoose');
let modules = require('./index');
mongoose.set('useFindAndModify', false);

for(let prop in modules) {
    mongoose.model(prop, new mongoose.Schema(modules[prop]));
    console.log(prop)
}

module.exports = {
    getModel: function(type) {
        return mongoose.model(type);
    }
};