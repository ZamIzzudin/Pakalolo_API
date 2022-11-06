const conn = require('../config')

exports.get = function (req, res) {
    conn.query(
        'SELECT * FROM barang',
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}


exports.add = function (req, res) {
    conn.query(
        'INSERT INTO barang (nama, harga, kategori, deskripsi, thumbnail, stok) VALUES (?,?,?,?,?,?)',
        [req.body.nama, req.body.harga, req.body.kategori, req.body.deskripsi, req.body.thumbnail, req.body.stok],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.delete = function (req, res) {
    conn.query(
        'DELETE FROM barang WHERE id = ?',
        [req.params.id_barang],
        (err, result) => {
            res.json({
                status: 'success',
                message: "data has been deleted"
            })
        }
    )
}

exports.update = function (req, res) {
    conn.query(
        'UPDATE barang SET nama = ?, harga = ?, kategori = ?, deskripsi = ?, thumbnail = ?,  update_at = CURRENT_TIMESTAMP WHERE id = ?',
        [req.body.nama, req.body.harga, req.body.kategori, req.body.deskripsi, req.body.thumbnail, req.params.id_barang],
        (err, result) => {
            res.json({
                status: "success",
                data: result
            })
        }
    )
}

exports.getOne = function (req, res) {
    console.log(req.params.id_barang)
    conn.query(
        'SELECT id, nama, harga, kategori, thumbnail, stok, deskripsi FROM barang WHERE id = ?',
        [req.params.id_barang],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.restock = function (req, res) {
    conn.query(
        'SELECT stok FROM barang WHERE id = ?',
        [req.params.id_barang],
        (err, result) => {
            conn.query(
                'UPDATE barang SET stok = ? WHERE id = ?',
                [req.body.stok + result[0].stok, req.params.id_barang],
                (err, result) => {
                    res.json({
                        data: result
                    })
                }
            )
        }
    )

}

exports.AllOrder = function (req, res) {
    conn.query(
        'SELECT pembelian.id, barang.thumbnail, barang.kategori, pembelian.created_at AS tanggal_pembelian, barang.nama, pembelian.jumlah, pembelian.status_pembelian, pembayaran.total_harga, pembayaran.status_pembayaran, pembayaran.via_pembayaran, pembelian.nama_pembeli, pembelian.alamat, pembelian.no_telp, jasa_pengiriman.nama AS "nama_pengiriman", jasa_pengiriman.jenis_pengiriman FROM pembelian INNER JOIN pembayaran ON pembelian.id = pembayaran.id_pembelian INNER JOIN barang ON pembelian.id_barang = barang.id INNER JOIN jasa_pengiriman ON pembelian.id_pengiriman = jasa_pengiriman.id WHERE pembayaran.status_pembayaran = "lunas"',
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.setOrderStatus = function (req, res) {
    conn.query(
        'UPDATE pembelian SET status_pembelian = ? WHERE id = ?',
        [req.body.status_pembelian, req.params.id_order],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}