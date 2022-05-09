const conn = require('../config')

exports.add = function (req, res) {
    conn.query(
        'INSERT INTO rating (id_pembelian, rate, ulasan) VALUES (?,?,?)',
        [req.body.id_pembelian, req.body.rate, req.body.ulasan],
        (err, result) => {
            conn.query(
                'UPDATE pembelian SET status_pembelian = "ulasan diberikan" WHERE id = ?',
                [req.body.id_pembelian],
                (err, result) => {
                    res.json({
                        data: result
                    })
                }
            )
        }
    )
}

exports.getOne = function (req, res) {
    conn.query(
        'SELECT rating.ulasan, rating.rate, user.username FROM rating INNER JOIN pembelian ON rating.id_pembelian = pembelian.id INNER JOIN user ON pembelian.id_user = user.id WHERE rating.id_pembelian = ?',
        [req.params.id_pembelian],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.getReview = function (req, res) {
    conn.query(
        'SELECT rating.ulasan, rating.rate, user.username FROM rating INNER JOIN pembelian ON rating.id_pembelian = pembelian.id INNER JOIN user ON pembelian.id_user = user.id WHERE pembelian.id_barang = ?;',
        [req.params.id_barang],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}