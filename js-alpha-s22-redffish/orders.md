# Get Orders

Used to collect multiple orders from BadgerShop.

**URL** : `/api/badgershop/orders`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

```
/api/badgershop/orders?amount={amn ∈ [0, 25]}
```

**Data example**

```
/api/badgershop/orders?amount=6
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
[
  {
    "date": "2021-03-15T13:19:14.501Z",
    "productName": "Ergonomic Plastic Car",
    "amount": 295.54
  },
  {
    "date": "2020-12-06T22:55:09.650Z",
    "productName": "Small Rubber Pizza",
    "amount": 532.38
  },
  {
    "date": "2021-03-18T01:33:33.159Z",
    "productName": "Incredible Metal Computer",
    "amount": 385.98
  },
  {
    "date": "2020-12-29T00:13:35.868Z",
    "productName": "Rustic Rubber Tuna",
    "amount": 365.21
  },
  {
    "date": "2021-03-19T04:59:35.556Z",
    "productName": "Handmade Metal Hat",
    "amount": 849.3
  },
  {
    "date": "2021-01-29T22:50:38.921Z",
    "productName": "Small Frozen Table",
    "amount": 646.73
  }
]
```

## Error Response

**Condition** : If an unexpected error occurs, or if an incorrect JSON is sent. Note that if a number is given outside the bounds, an empty array is returned.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "error-msg": "Oops! Something went wrong. Check to make sure that you are sending a valid request. Your recieved request is provided below. If it is empty, then it was most likely not provided or malformed. If you have verified that your request is valid, please contact a CS571 administrator.",
  "error-req": "{}",
  "date-time": "8/23/2021 9:07:39 PM"
}
```
