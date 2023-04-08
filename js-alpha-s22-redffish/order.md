# Get Order

Used to collect a order from BadgerShop.

**URL** : `/api/badgershop/order`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

```json
{}
```

**Data example**

```json
{}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "date": "2021-05-15T05:45:15.395Z",
  "productName": "Fantastic Wooden Fish",
  "amount": 604.21
}
```

## Error Response

**Condition** : If an unexpected error occurs.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "error-msg": "Oops! Something went wrong. Check to make sure that you are sending a valid request. Your recieved request is provided below. If it is empty, then it was most likely not provided or malformed. If you have verified that your request is valid, please contact a CS571 administrator.",
  "error-req": "{}",
  "date-time": "8/23/2021 9:02:48 PM"
}
```
