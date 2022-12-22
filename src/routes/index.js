const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Pakalolo API',
        createdBy: "KakUdinnn"
    })
})

// Login System
const login = require('../controller/login');

router.route('/login')
    .post(login.check)

router.route('/regist')
    .post(login.regist)

router.route('/getUser/:id_user')
    .get(login.getUser)
    .put(login.updateUser)

router.route('/changePassword/:id_user')
    .put(login.changePassword)

// Storage/Inventory System
const storage = require('../controller/storage')

router.route('/storage')
    .get(storage.get)
    .post(storage.add)

router.route('/storage/:id_barang')
    .post(storage.restock)
    .get(storage.getOne)
    .delete(storage.delete)
    .patch(storage.update)
    .put(storage.update)

router.route('/order')
    .get(storage.AllOrder)

router.route('/order/:id_order')
    .put(storage.setOrderStatus)

// Sale System
const sale = require('../controller/sale')

router.route('/kategori')
    .get(sale.getCategories)

router.route('/sort_kategori/:kategori')
    .get(sale.getByCategories)

router.route('/all_sale/:sorted')
    .get(sale.get)

router.route('/sale/:id_barang')
    .post(sale.buy)

router.route('/pay/:id_pembayaran')
    .post(sale.pay)

router.route('/mytransaction/:id_user')
    .get(sale.myTransaction)

router.route('/pengiriman')
    .get(sale.getPengiriman)

router.route('/search/:search')
    .get(sale.search)

// Sale - Promotion
router.route('/getFeatured')
    .get(sale.getFeatured)

router.route('/latestProduct')
    .get(sale.latestProduct)

router.route('/popularProduct')
    .get(sale.popularProduct)

router.route('/managePromotion/:id_barang')
    .post(sale.addPromotion)
    .delete(sale.deletePromotion)

// Wishlist
const wishlist = require('../controller/wishlist');

router.route('/wishlist')
    .post(wishlist.add)
    .put(wishlist.total)

router.route('/wishlist/:id_wishlist')
    .get(wishlist.getOne)
    .post(wishlist.buy)
    .put(wishlist.update)
    .delete(wishlist.delete)

router.route('/mywishlist/:id_user')
    .get(wishlist.get)


// Delivery
const delivery = require('../controller/delivery')

router.route('/delivery')
    .post(delivery.addPengiriman)
    .put(delivery.updatePengiriman)

router.route('/delivery/:id_pembelian')
    .get(delivery.getOnePengiriman)

router.route('/newDeliveryVend')
    .post(delivery.addJasaPengiriman)

// Rating
const rating = require('../controller/rating');

router.route('/rating')
    .post(rating.add)

router.route('/rating/:id_pembelian')
    .get(rating.getOne)

router.route('/review/:id_barang')
    .get(rating.getReview)


router.route('/banner')
    .get(sale.getBanner)

router.route('/banner/:id_banner')
    .put(sale.updateBanner)
    .get(sale.getOneBanner)

module.exports = router