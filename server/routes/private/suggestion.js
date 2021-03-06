const
    express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt'),
    pg = require('pg');


router.use(expressJwt({secret: process.env.jwtSecret}));

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

const client = new pg.Client(connectionString);
client.connect();

router.post('/', function( req, res, next ){

    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('material', 'Invalid material').isCustomAllowedText();
    req.checkBody('notes', 'Invalid comment').isCustomAllowedText();

    var data = req.body;
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    }else {
        pg.connect( connectionString , function( err, client , done){
            if( err ){
                console.log(err);
                res.status(500).send({message: err.message});
            } else {
                client.query('INSERT INTO suggestions(email, material, notes) VALUES($1, $2, $3)', [data.email, data.material, data.notes]);
                done();
                res.status(200).send({message: 'Suggestion submitted.'});
            }
        });
    }

});

router.post('/getSuggestions', function( req, res, next){
    console.log('get suggestions', req.body);
    if(req.body.username == process.env.adminUser && req.body.password == process.env.adminPass) {
        var suggestions = [];

        pg.connect(connectionString, function (err, client, done) {
            if (err) console.log(err);

            client.query('select * from suggestions where complete = false',
                function (err, results) {
                    done();
                    suggestions = results.rows;
                    res.send(suggestions);

                });
        });
    }
});

router.put('/complete/:id', function( req, res, next ){

    var id = req.params.id;

    pg.connect( connectionString, function( err, client, done ){
        if (err) console.log(err);

        client.query('UPDATE suggestions SET complete = TRUE where suggestions.id = $1', [id]);
        done();
        res.sendStatus(200);
    })

});

module.exports = router;