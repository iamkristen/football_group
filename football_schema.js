const {Schema} = require('mongoose');

const footballSchema = new Schema({
    team :{ type: String, required:true},
    gamesPlayed: {type: Number, required: true},
    win: {type: Number, required: true},
    draw: {type: Number, required: true},
    loss: {type: Number, required: true},
    goalsFor: {type: Number, required: true},
    goalsAgainst: {type: Number, required: true},
    points: {type: Number, required: true},
    year: {type: Number, required: true}
})

module.export = footballSchema;