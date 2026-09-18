const Constants = {
    "userRole": {
        "ADMIN": "ADMIN",
        "PROVIDER": "PROVIDER",
        "USER": "USER"
    },
    "adminCode": "ADMIN001",
    "verifiedStatus": "verified",
    "notVerifiedStatus": "notverified",
    "verificationFor": {
        "userPhone": "userPhone",
        "providerPhone": "providerPhone",
        "deliveryPhone": "deliveryBoyPhone"
    },
    "appServices": {
        "homeService": "home",
        "deliveryService": "delivery",
        "onlineService": "online",
        "foodService": "food"
    },
    "paymentStatus": {
        "paid": "paid",
        "notpaid": "notpaid"
    },
    "paymentMode": {
        "cash": "cash",
        "card": "card",
        "wallet": "wallet"
    },
    "notoficationForProviders": [
        {
            "label": "All Providers",
            "value": "AP"
        },
        {
            "label": "All Offline Providers",
            "value": "AOP"
        }
    ],
    "notoficationForUsers": [
        {
            "label": "All Users",
            "value": "AU"
        },
        {
            "label": "All Offline Users",
            "value": "AOU"
        }
    ],
    "blockStatus":{
        "block": "block",
        "unblock": "unblock"
      }
};

export { Constants };
