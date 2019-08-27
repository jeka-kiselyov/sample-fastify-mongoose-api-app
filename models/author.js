const _ = require('lodash');

module.exports = function(mongoose, connection, db) {
    var modelName = 'Author';
    var schema = mongoose.Schema({
        firstName: String,
        lastName: String,
        biography: String,
        created: { type: Date, default: Date.now }
    }, 
    { collection: 'authors' });
    
    schema.index({'$**': 'text'});

    // schema.virtual('APIValues').get(function () {    });  //// - item.APIValues
    // schema.statics.getActive = function() {   };         ///// - db.Size.getActive()
    // schema.methods.updateSomething = function() {   };   ///// - item.updateSomething()
    //         
    var model = connection.model(modelName, schema);
    return {
        'modelName': modelName,
        'model': model
    };
};
