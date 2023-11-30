const {model,Schema} = require("mongoose");

const footballSchema = new Schema({
    Team :{ type: String, required:true},
    "Games Played": {type: Number, required: true},
    Win: {type: Number, required: true},
    Draw: {type: Number, required: true},
    Loss: {type: Number, required: true},
    "Goals For": {type: Number, required: true},
    "Goals Against": {type: Number, required: true},
    Points: {type: Number, required: true},
    Year: {type: Number, required: true}
});

const football = model('football',footballSchema);
module.exports = football;