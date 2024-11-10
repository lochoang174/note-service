var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SharingSchema = new Schema({
    account:{
        type: String,
        required: true
    },
  notes: [{
    type: [Schema.Types.ObjectId],
    ref: 'Note',
    required: true
  }],


},{
    timestamps: true
});
module.exports = mongoose.model("Sharing", SharingSchema);
