const passportInstance = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/User');

passportInstance.use(new localStrategy(
    {usernameField: 'email'}, 
    (email, password, done) => {
        User.findOne({email: email})
            .then(user => {
                if(!user){
                    return done(null, false, { message: 'The email is not registered' });
                }
                else{
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }
                        else{
                            return done(null, false, { message: 'Password is incorrect'});
                        }
                    });
                }
            })
            .catch(err => console.log(err));
    }
));

passportInstance.serializeUser((user, done) => {
    done(null, user.id);
});
  
passportInstance.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passportInstance;