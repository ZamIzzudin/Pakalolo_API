const conn = require('../config')
const bcrypt = require('bcrypt')

exports.check = function (req, res) {
    conn.query(
        `SELECT * FROM user WHERE email = ?`,
        [req.body.email],
        async (error, result) => {
            if (result.length > 0) {
                const isMatch = await bcrypt.compare(req.body.password, result[0].password)
                if (isMatch) {
                    res.json({
                        status: true,
                        username: result[0].username,
                        role: result[0].auth,
                        id: result[0].id
                    })
                } else {
                    res.json({
                        status: false
                    })
                }
            } else {
                res.json({
                    status: false
                })
            }
        }
    )
}

exports.regist = function (req, res) {
    conn.query(
        'SELECT * FROM user WHERE username = ? OR email = ?',
        [req.body.username, req.body.email],
        (err, result) => {
            if (result.length === 0) {
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) { return console.log(err) }

                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (err) { return console.log(err) }

                        conn.query(
                            `INSERT INTO user (username, email, password, auth) VALUES (?, ?, ?, 'customer')`,
                            [req.body.username, req.body.email, hash],
                            (err, result) => {
                                res.json({
                                    result: result,
                                })
                            }
                        )
                    })
                })
            } else {
                res.json({
                    status: 'error',
                    message: 'Email or Username has been used'
                })
            }
        }
    )
}

exports.getUser = function (req, res) {
    conn.query(
        'SELECT * FROM user WHERE id = ?',
        [req.params.id_user],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.updateUser = function (req, res) {
    conn.query(
        'UPDATE user SET username = ? , email = ? WHERE id = ?',
        [req.body.username, req.body.email, req.params.id_user],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.changePassword = function (req, res) {
    conn.query(
        `SELECT * FROM user WHERE id = ?`,
        [req.params.id_user],
        async (error, result) => {
            if (result.length > 0) {
                const isMatch = await bcrypt.compare(req.body.password, result[0].password)
                if (isMatch) {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(req.body.new_password, salt, function (err, hash) {
                            conn.query(
                                `UPDATE user SET password = ? WHERE id = ?`,
                                [hash, req.params.id_user],
                                (err, result) => {
                                    res.json({
                                        status: true
                                    })
                                }
                            )
                        })
                    })
                } else {
                    res.json({
                        status: false
                    })
                }
            } else {
                res.json({
                    status: false
                })
            }
        }
    )
}