const conn = require('../config')

exports.buy = function (req, res) {
    let harga = 0
    conn.query(
        'SELECT harga FROM barang WHERE id = ?',
        [req.params.id_barang],
        (err, result) => {
            harga = result[0].harga * req.body.jumlah
            console.log(result[0].harga)
            conn.query(
                'SELECT harga FROM jasa_pengiriman WHERE id = ?',
                [req.body.id_pengiriman],
                (err, result) => {
                    harga += result[0].harga
                    conn.query(
                        'INSERT INTO pembelian (id_barang, id_user, jumlah, id_pengiriman, alamat, nama_pembeli, status_pembelian, no_telp, catatan_pembeli, ukuran) VALUES (?,?,?,?,?,?,"belum dikonfirmasi",?,?,?)',
                        [req.params.id_barang, req.body.id_user, req.body.jumlah, req.body.id_pengiriman, req.body.alamat, req.body.nama_pembeli, req.body.no_telp, req.body.catatan_pembeli, req.body.ukuran],
                        (err, result) => {
                            conn.query(
                                'INSERT INTO pembayaran (id_pembelian, total_harga, via_pembayaran, status_pembayaran) VALUES (?,?,?,"belum lunas")',
                                [result.insertId, harga, req.body.via_pembayaran],
                                (err, result) => {
                                    res.json({
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

exports.get = function (req, res) {
    let data
    conn.query(
        `SELECT id, nama, harga, kategori, thumbnail FROM barang ORDER BY update_at ${req.params.sorted}`,
        (err, result) => {
            data = result
            data.forEach((x, i) => {
                conn.query(
                    'SELECT AVG(rate) AS rate FROM rating INNER JOIN pembelian ON pembelian.id = rating.id_pembelian WHERE pembelian.id_barang = ?',
                    [x.id],
                    (err, result) => {
                        data[i]['rate'] = result[0].rate
                    }
                )
            })

            setTimeout(() => {
                res.json({
                    data: data
                })
            }, 100);
        }
    )
}

exports.getCategories = function (req, res) {
    let kategori = []
    conn.query(
        "SELECT kategori FROM barang GROUP BY kategori",
        (err, result) => {
            result.forEach(x => {
                kategori.push(x.kategori)
            })
            res.json({
                data: kategori
            })
        }
    )
}

exports.getByCategories = function (req, res) {
    let data
    conn.query(
        `SELECT id, nama, harga, kategori, thumbnail FROM barang WHERE kategori = "${req.params.kategori}"`,
        (err, result) => {
            data = result
            data.forEach((x, i) => {
                conn.query(
                    'SELECT AVG(rate) AS rate FROM rating INNER JOIN pembelian ON pembelian.id = rating.id_pembelian WHERE pembelian.id_barang = ?',
                    [x.id],
                    (err, result) => {
                        data[i]['rate'] = result[0].rate
                    }
                )
            })

            setTimeout(() => {
                res.json({
                    data: data
                })
            }, 100);
        }
    )
}

exports.pay = function (req, res) {
    conn.query(
        'UPDATE pembayaran SET status_pembayaran = "lunas", bukti_pembayaran = ? WHERE id = ?',
        [req.body.bukti_pembayaran, req.params.id_pembayaran],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.myTransaction = function (req, res) {
    conn.query('SELECT pembayaran.id, barang.id AS id_barang, pembelian.id AS id_pembelian, barang.thumbnail, barang.nama, pembelian.jumlah, pembayaran.total_harga, pembayaran.status_pembayaran, pembayaran.via_pembayaran, pembelian.status_pembelian, barang.kategori, pembelian.created_at, pembelian.ukuran FROM pembelian INNER JOIN pembayaran ON pembelian.id = pembayaran.id_pembelian INNER JOIN barang ON pembelian.id_barang = barang.id WHERE pembelian.id_user = ? ORDER BY pembelian.created_at DESC',
        [req.params.id_user],
        (err, result) => {
            res.json({
                data: result
            })
        })
}

exports.getPengiriman = function (req, res) {
    conn.query('SELECT * FROM jasa_pengiriman',
        (err, result) => {
            res.json({
                data: result
            })
        })
}

// Promotion

exports.getFeatured = function (req, res) {
    conn.query(
        'SELECT barang.id, barang.nama, barang.harga, barang.kategori, barang.thumbnail, promotion.jenis_promotion FROM barang INNER JOIN promotion ON barang.id = promotion.id_barang WHERE promotion.jenis_promotion = "featured product" LIMIT 4',
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.addPromotion = function (req, res) {
    conn.query(
        "INSERT INTO promotion (id_barang, jenis_promotion) VALUES (?,'featured product')",
        [req.params.id_barang],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.deletePromotion = function (req, res) {
    conn.query(
        "DELETE FROM promotion WHERE id_barang = ?",
        [req.params.id_barang],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.latestProduct = function (req, res) {
    conn.query(
        'SELECT barang.id, barang.nama, barang.harga, barang.kategori, barang.update_at, barang.thumbnail FROM barang ORDER BY `barang`.`update_at` DESC limit 6',
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.popularProduct = function (req, res) {
    conn.query(
        'SELECT barang.id, barang.nama, barang.harga, barang.kategori, barang.update_at, barang.thumbnail, count(pembelian.id_barang) AS "jumlah order" FROM pembelian INNER JOIN barang ON pembelian.id_barang = barang.id GROUP BY id_barang limit 4',
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.search = function (req, res) {
    let data
    conn.query(
        `SELECT id, nama, harga, kategori, thumbnail FROM barang WHERE nama LIKE "%${req.params.search}%"`,
        (err, result) => {
            data = result
            data.forEach((x, i) => {
                conn.query(
                    'SELECT AVG(rate) AS rate FROM rating INNER JOIN pembelian ON pembelian.id = rating.id_pembelian WHERE pembelian.id_barang = ?',
                    [x.id],
                    (err, result) => {
                        data[i]['rate'] = result[0].rate
                    }
                )
            })

            setTimeout(() => {
                res.json({
                    data: data
                })
            }, 100);
        }
    )
}

exports.getBanner = function (req, res) {
    conn.query(
        'SELECT * FROM banner',
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.updateBanner = function (req, res) {
    conn.query(
        'UPDATE banner SET title = ?, thumbnail = ?, deskripsi = ? WHERE id_banner = ?',
        [req.body.title, req.body.thumbnail, req.body.deskripsi, req.params.id_banner],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}

exports.getOneBanner = function (req, res) {
    conn.query(
        'SELECT * FROM banner WHERE id_banner = ?',
        [req.params.id_banner],
        (err, result) => {
            res.json({
                data: result
            })
        }
    )
}