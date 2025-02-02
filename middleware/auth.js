const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

const loginValidator = [
    check('email').isEmail(),
    check('password').isLength({min : 8}).withMessage('Minimum password is 8 character'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) return next()
        return res.status(400).send(errors)
    }
]

const registerValidator = [
    check('email').isEmail().bail().custom( async (value) => {
        const email = await User.find({email : value})
        if (email.length !== 0) throw new Error('Email is Already to Used')
        return true 
    }),
    check('password').isLength({min : 8}).withMessage('Minimum password is 8 character'),
    check('passwordConfirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true
    }),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) return next()
        return res.status(400).send(errors)
    }
]

const authenticate = (req, res, next) => {
    const token = req.cookies['x-access-token']
    if (!token) return res.status(401).send({
        status : 'error',
        msg : 'Token Not Found'
    })

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, result) => {
        if (err) return res.status(403).send({
            status : 'error',
            msg : 'Token Is Wrong'
        })
        req.user = result
        next()
    })
}

module.exports = {
    loginValidator,
    registerValidator,
    authenticate
}