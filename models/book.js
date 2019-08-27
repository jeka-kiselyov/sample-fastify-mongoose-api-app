const _ = require('lodash');

module.exports = function(mongoose, connection, db) {
    var modelName = 'Book';
    var schema = mongoose.Schema({
        title: String,
        isbn: String,
        author: {  type: mongoose.Schema.Types.ObjectId,  ref: 'Author' },
        created: {  type: Date, default: Date.now }
    }, 
    { collection: 'books' });
    
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
