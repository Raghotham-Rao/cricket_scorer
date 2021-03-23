const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const matchSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    team1_name: String,
    team2_name: String,
    toss_won_by: String,
    batting_first: String,
    result: {
        type: String,
        default: "TBD"
    },
    pool_master: String
})

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;