const router = require('express').Router();
const mongoose = require('mongoose');
const Match = require('./../models/Match');

router.get('/', (req, res) => {
    Match.find((err, docs) => {
        res.json(docs);
    });
});

router.post('/create', (req, res) => {
    var match = new Match(req.body);
    match['pool_master'] = req.user.email;
    match.save().then(d => res.json(d));
});

router.get('/:id', (req, res) => {
    Match.findById(req.params.id, (err, doc) => {
        if(err){
            res.json({"message": err});
        }
        else{
            res.json(doc);
        }
    });
});

module.exports = router;