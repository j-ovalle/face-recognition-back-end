const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, name, password} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(hashErr, hash) {
        db.transaction(trx => {
            if (hashErr) { throw hashErr; }
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })       
            })
            .then(trx.commit)
            .catch(trx.rollback)
            console.log("XD");
        })
        .catch(err =>
            console.log(err),
            res.status(400).json('Unable to register')
        );
    })
}

module.exports = {
    handleRegister
};