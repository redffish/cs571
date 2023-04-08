const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const app = express();
const fetch = require("node-fetch");
const base64 = require("base-64");

let username = "";
let password = "";
let token = "";

let getWithoutToken = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

USE_LOCAL_ENDPOINT = false;
// set this flag to true if you want to use a local endpoint
// set this flag to false if you want to use the online endpoint
ENDPOINT_URL = "";
if (USE_LOCAL_ENDPOINT) {
  ENDPOINT_URL = "http://127.0.0.1:5000";
} else {
  ENDPOINT_URL = "https://cs571.cs.wisc.edu";
}

async function getToken() {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + base64.encode(username + ":" + password),
    },
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/login", request);
  const serverResponse = await serverReturn.json();
  token = serverResponse.token;

  return token;
}

async function displayAgentMessageOnly(message, agent) {
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      "isUser": false,
      "text": message,
    }),
  };
  await fetch(ENDPOINT_URL + "/application/messages", request);
}

async function displayAgentMessage(message, agent) {
  agent.add(message);

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      "isUser": false,
      "text": message,
    }),
  };
  await fetch(ENDPOINT_URL + "/application/messages", request);
}

async function displayUserMessage(message) {
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({
      "isUser": true,
      "text": message,
    }),
  };
  await fetch(ENDPOINT_URL + "/application/messages", request);
}

async function clearAllMessages() {
  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    }
  };

  const serverReturn = await fetch(ENDPOINT_URL + "/application/messages/", request);
  const serverResponse = await serverReturn.json();
  return serverResponse;
}

async function getProductId() {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const serverReturn = await fetch(ENDPOINT_URL + "/application", request);
  const serverResponse = await serverReturn.json();
  let uri = serverResponse["page"];
  let id = -1;
  let i = uri.search("products");
  if (i !== -1) {
    id = uri.substring(i + 9, uri.length);
  }
  return id;
}

app.get("/", (req, res) => res.send("online"));
app.post("/", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  async function welcome() {
    await displayUserMessage(agent.query);
    await displayAgentMessage("Hello! How can I help you?", agent);
  }

  async function login() {
    // You need to set this as the value of the `username` parameter that you defined in Dialogflow
    username = agent.parameters.username;
    // You need to set this as the value of the `password` parameter that you defined in Dialogflow
    password = agent.parameters.password;

    await getToken();
    await clearAllMessages();
    await displayAgentMessageOnly("Hello! How can I help you?", agent);
    await displayUserMessage("login");
    await displayAgentMessageOnly("What is your username?", agent);
    await displayUserMessage(username);
    await displayAgentMessageOnly("And your password?", agent);
    await displayUserMessage(password);

    let successMessage = "Welcome to WiscShop, " + username + "!";
    let failureMessage = "Oops, you've entered wrong username or password.";

    if (token !== undefined) {
      await displayAgentMessage(successMessage, agent);
    } else {
      await displayAgentMessage(failureMessage, agent);
    }
  }

  async function categoryQuery() {
    await displayUserMessage(agent.query);

    const serverReturn = await fetch(ENDPOINT_URL + "/categories", getWithoutToken);
    const serverResponse = await serverReturn.json();

    let categories = serverResponse["categories"];
    let categoryMessage = "We currently have 6 categories of items available: ";
    for (let i = 0; i < categories.length - 1; i++) {
      categoryMessage += categories[i] + ", ";
    }
    categoryMessage += "and " + categories[categories.length - 1];
    await displayAgentMessage(categoryMessage, agent);
  }

  async function cartQuery() {
    await displayUserMessage(agent.query);
    let request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    };

    const serverReturn = await fetch(ENDPOINT_URL + "/application/products", request);
    const serverResponse = await serverReturn.json();

    let cartInfo = agent.parameters.cartInfo;
    let products = serverResponse["products"];
    let cartMessage = "";
    if (products === undefined || products === "" || products.length <= 0) {
      cartMessage += "Your cart is currently empty!";
      await displayAgentMessage(cartMessage, agent);
      return;
    }
    switch (cartInfo) {
      case "cost":
        let total = 0;
        cartMessage += "The current cart total is: ";
        for (let i = 0; i < products.length; i++) {
          total += products[i].price;
        }
        cartMessage += "$ " + total;
        break;
      case "type":
        cartMessage += "These types of items are currently in cart: ";
        for (let i = 0; i < products.length - 1; i++) {
          cartMessage += products[i].category + ", ";
        }
        cartMessage += products[products.length - 1].category;
        break;
      case "number":
        cartMessage += "The current quantity of items in cart is: ";
        let count = 0;
        for (let i = 0; i < products.length; i++) {
          count += products[i].count;
        }
        break;
      case "name":
        cartMessage = "These items are currently in cart: ";
        for (let i = 0; i < products.length - 1; i++) {
          cartMessage += products[i].name + ", ";
        }
        cartMessage += "and " + products[products.length - 1].name;
        break;
    }
    await displayAgentMessage(cartMessage, agent);
  }

  async function productInfoQuery() {
    await displayUserMessage(agent.query);

    let getRequest = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    };

    let productMessage = "";
    let productInfo = agent.parameters.productInfo;

    let id = await getProductId();

    if (id == -1) { // user not at a product page
      productMessage += "Please go to a specific product page before requesting more information!";
      await displayAgentMessage(productMessage, agent);
      return;
    }

    // get product information page
    const serverReturnProduct = await fetch(ENDPOINT_URL + "/products/" + id, getRequest);
    let product = await serverReturnProduct.json();

    // get product review page
    const serverReturnReview = await fetch(ENDPOINT_URL + "/products/" + id + "/reviews", getRequest);
    const serverResponseReview = await serverReturnReview.json();
    let reviews = serverResponseReview["reviews"];

    switch (productInfo) {
      case "name":
        productMessage += "This is " + product["name"];
        break;
      case "category":
        productMessage += "This product is from " + product["category"] + " category";
        break;
      case "description":
        productMessage += product["description"];
        break;
      case "price":
        productMessage += "It's $" + product["price"];
        break;
      case "other buyer":
        if (reviews === undefined || reviews.length === 0) {
          productMessage += "This product has no reviews yet. Be the first to buy and review!";
        } else {
          let review = reviews[0].title + " ";
          review += reviews[0].text;
          productMessage += "Found " + reviews.length + " review(s) for this product! ";
          productMessage += "Let me show you the first one: ";
          productMessage += review;
        }
        break;
      case "rating":
        if (reviews === undefined || reviews.length === 0) {
          productMessage += "This product has no ratings yet. Be the first to buy and rate!";
        } else {
          let ratings = 0;
          for (let i = 0; i < reviews.length; i++) {
            ratings += reviews[i].stars;
          }
          productMessage += "There are " + reviews.length + " ratings for this product, with an ";
          productMessage += "average rating of " + ratings/reviews.length + " stars";
        }
        break;
      default:
        productMessage += "This is a " + product["name"] + ". The price is $" + product["price"];
        break;
    }
    await displayAgentMessage(productMessage, agent);
  }

  async function addToCart() {
    await displayUserMessage(agent.query);

    let addMessage = "";
    let id = await getProductId();

    if (id === -1) {
      addMessage += "Please go to a specific product page before adding to cart!";
      await displayAgentMessage(addMessage, agent);
      return;
    }

    let postRequest = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    };
    await fetch(ENDPOINT_URL + "/application/products/" + id, postRequest);

    const serverReturn = await fetch(ENDPOINT_URL + "/products/" + id, getWithoutToken);
    let product = await serverReturn.json();
    addMessage += "One " + product["name"] + " added to your cart!";

    await displayAgentMessage(addMessage, agent);
  }

  async function removeFromCart() {
    await displayUserMessage(agent.query);

    let removeMessage = "";
    let id = await getProductId();

    if (id === -1) {
      removeMessage += "Please go to a specific product page before removing from cart!";
      await displayAgentMessage(removeMessage, agent);
      return;
    }

    let deleteRequest = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    };
    await fetch(ENDPOINT_URL + "/application/products/" + id, deleteRequest);

    const serverReturn = await fetch(ENDPOINT_URL + "/products/" + id, getWithoutToken);
    let product = await serverReturn.json();
    removeMessage += "One " + product["name"] + " removed from your cart!";

    await displayAgentMessage(removeMessage, agent);
  }

  async function clearCart() {
    await displayUserMessage(agent.query);

    let request = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    };
    await fetch(ENDPOINT_URL + "/application/products", request);

    await displayAgentMessage("Your cart is now empty!", agent);
  }

  async function reviewCart() {
    await displayUserMessage(agent.query);

    let request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({"page": "/" + username + "/cart-review"}),
    };
    await fetch(ENDPOINT_URL + "/application", request);

    await displayAgentMessage("Please review your cart", agent);
  }

  async function confirmCart() {
    await displayUserMessage(agent.query);

    let request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({"page": "/" + username + "/cart-confirmed"}),
    };
    await fetch(ENDPOINT_URL + "/application", request);

    await displayAgentMessage("Thank you! Your order has been placed :)", agent);
  }

  async function navigate() {
    await displayUserMessage(agent.query);

    let dest = agent.parameters.dest;
    if (dest === "Home") {
      dest = "";
    }

    let request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({"page": "/" + username + "/" + dest}),
    };
    await fetch(ENDPOINT_URL + "/application", request);

    let navMessage = ["Sure", "Sure thing", "Of course!", "My pleasure!", "Absolutely!"]
    await displayAgentMessage(navMessage[Math.floor(Math.random()*navMessage.length)], agent);
  }

  async function navigateToProduct() {
    await displayUserMessage(agent.query);

    const bottoms = ["14", "15", "16", "17"];
    const hats = ["10", "11"];
    const leggings = ["4", "6"];
    const plushes = ["3", "5", "7", "8", "9"];
    const sweatshirts = ["2", "13"]
    const tees = ["12"];

    let productId = agent.parameters.product;
    let subdir = "";

    if (bottoms.includes(productId)) {
      subdir = "/bottoms";
    } else if (hats.includes(productId)) {
      subdir = "/hats";
    } else if (leggings.includes(productId)) {
      subdir = "/leggings";
    } else if (plushes.includes(productId)) {
      subdir = "/plushes";
    } else if (sweatshirts.includes(productId)) {
      subdir = "/sweatshirts";
    } else if (tees.includes(productId)) {
      subdir = "/tees";
    } 

    let request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({"page": "/" + username + subdir + "/products" + "/" + productId}),
    };
    await fetch(ENDPOINT_URL + "/application", request);

    let navMessage = ["Sure", "Sure thing", "Of course!", "My pleasure!", "Absolutely!"]
    await displayAgentMessage(navMessage[Math.floor(Math.random()*navMessage.length)], agent);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  // You will need to declare this `Login` intent in DialogFlow to make this work
  intentMap.set("Login", login);
  intentMap.set("CategoryQuery", categoryQuery);
  intentMap.set("CartQuery", cartQuery);
  intentMap.set("ProductInfoQuery", productInfoQuery);
  intentMap.set("AddToCart", addToCart);
  intentMap.set("RemoveFromCart", removeFromCart);
  intentMap.set("ClearCart", clearCart);
  intentMap.set("ReviewCart", reviewCart);
  intentMap.set("ConfirmCart", confirmCart);
  intentMap.set("Navigate", navigate);
  intentMap.set("NavigateToProduct", navigateToProduct);
  agent.handleRequest(intentMap);
});

app.listen(process.env.PORT || 8080);
