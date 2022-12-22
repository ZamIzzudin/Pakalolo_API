const conn = require('../config')

exports.addPengiriman = function (req, res) {
    conn.query(
        'INSERT INTO pengiriman (id_pembelian, no_resi) VALUES (?,?)',
        [req.body.id_pembelian, req.body.no_resi],
        (err, result) => {
            conn.query(
                'UPDATE pembelian SET status_pembelian = "barang dikirim" WHERE id = ?',
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

exports.updatePengiriman = function (req, res) {
    conn.query(
        'UPDATE pembelian SET status_pembelian = "barang sudah sampai" WHERE id = ?',
        [req.body.id_pembelian],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.getOnePengiriman = function (req, res) {
    conn.query(
        'SELECT pengiriman.no_resi, pengiriman.update_at AS "tanggal_dikirim", jasa_pengiriman.nama, jasa_pengiriman.jenis_pengiriman FROM pengiriman INNER JOIN pembelian ON pembelian.id = pengiriman.id_pembelian INNER JOIN jasa_pengiriman ON jasa_pengiriman.id = pembelian.id_pengiriman WHERE pengiriman.id_pembelian = ?',
        [req.params.id_pembelian],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.addJasaPengiriman = function (req, res) {
    conn.query(
        "INSERT INTO jasa_pengiriman (nama, jenis_pengiriman, durasi, harga) VALUES (?,?,?,?)",
        [req.body.nama, req.body.jenis_pengiriman, req.body.durasi, req.body.harga],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}