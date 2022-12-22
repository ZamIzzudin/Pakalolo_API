const conn = require('../config')

exports.add = function (req, res) {
    conn.query(
        'SELECT harga FROM barang WHERE id = ?',
        [req.body.id_barang],
        (err, result) => {
            conn.query(
                "INSERT INTO wishlist (id_user, id_barang, jumlah, total_harga, ukuran) VALUES (?,?,?,?,?)",
                [req.body.id_user, req.body.id_barang, req.body.jumlah, result[0].harga * req.body.jumlah, req.body.ukuran],
                (err, result) => {
                    res.json({
                        status: "success",
                        data: result
                    })
                }
            )
        }
    )
}

exports.get = function (req, res) {
    conn.query(
        'SELECT wishlist.id, wishlist.ukuran, wishlist.jumlah, wishlist.total_harga, barang.thumbnail, barang.nama, barang.harga FROM wishlist INNER JOIN barang ON wishlist.id_barang = barang.id WHERE wishlist.id_user = ? ;',
        [req.params.id_user],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.getOne = function (req, res) {
    conn.query(
        'SELECT wishlist.id, barang.nama, wishlist.ukuran, barang.thumbnail, wishlist.jumlah, wishlist.total_harga, barang.kategori FROM wishlist INNER JOIN barang ON wishlist.id_barang = barang.id WHERE wishlist.id = ?',
        [req.params.id_wishlist],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.delete = function (req, res) {
    conn.query(
        'DELETE FROM wishlist WHERE id = ?',
        [req.params.id_wishlist],
        (err, result) => {
            res.json({
                status: 'success',
                data: result
            })
        }
    )
}

exports.total = function (req, res) {
    conn.query(
        'SELECT SUM(total_harga) AS "total" FROM wishlist WHERE id_user = ?',
        [req.body.id_user],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.buy = function (req, res) {
    let current_order = ""
    conn.query(
        'SELECT id_user, id_barang, total_harga, jumlah FROM wishlist WHERE id = ?',
        [req.params.id_wishlist],
        (err, result) => {
            current_order = result[0]
            conn.query(
                'SELECT harga FROM jasa_pengiriman WHERE id = ?',
                [req.body.id_pengiriman],
                (err, result) => {
                    current_order.total_harga += result[0].harga
                    conn.query(
                        'INSERT INTO pembelian (id_barang, id_user, alamat, jumlah, id_pengiriman, nama_pembeli, status_pembelian, no_telp, catatan_pembeli, ukuran) VALUES (?,?,?,?,?,?,"belum dikonfirmasi",?,?,?)',
                        [current_order.id_barang, current_order.id_user, req.body.alamat, current_order.jumlah, req.body.id_pengiriman, req.body.nama_pembeli, req.body.no_telp, req.body.catatan_pembeli, req.body.ukuran],
                        (err, result) => {
                            conn.query(
                                'INSERT INTO pembayaran (id_pembelian, total_harga, via_pembayaran, status_pembayaran) VALUES (?,?,?,"belum lunas")',
                                [result.insertId, current_order.total_harga, req.body.via_pembayaran],
                                (err, result) => {
                                    conn.query(
                                        'DELETE FROM wishlist WHERE id = ?',
                                        [req.params.id_wishlist],
                                        (err, result) => {
                                            res.json({
                                                status: "success",
                                                data: result
                                            })
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            )
        }
    )
}

exports.update = function (req, res) {
    conn.query(
        'SELECT * FROM wishlist WHERE id = ?',
        [req.params.id_wishlist],
        (err, result) => {
            let each_price = result[0].total_harga / result[0].jumlah
            conn.query(
                'UPDATE wishlist set jumlah = ? , total_harga = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?',
                [req.body.jumlah, each_price * req.body.jumlah, req.params.id_wishlist],
                (err, result) => {
                    res.json({
                        status: "success",
                        data: result
                    })
                }
            )
        }
    )
}