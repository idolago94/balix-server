var express = require('express');
var router = express.Router();
const paypal = require("paypal-rest-sdk");

router.get("/", (req, res) => {
    console.log(req.query.amount);
    let amount = req.query.amount;
    res.render("paymentFrom", {amount: amount});
});

router.get('/paypal', (req, res) => {
    console.log('/payment/paypal...', req.query.amount);
    let amount = req.query.amount;
    const create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: "http://localhost:3000/payment/success",
            cancel_url: "http://localhost:3000/payment/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "item",
                            sku: "item",
                            price: amount,
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: amount
                },
                description: "This is the payment description."
            }
        ]
    };
    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href);
        }
    });
})

router.get("/success", (req, res) => {
    res.render('success');
});

router.get("cancel", (req, res) => {
    res.render("cancel");
});

module.exports = router;
