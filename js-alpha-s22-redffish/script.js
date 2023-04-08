// TODO Complete this file as described by the README.md
// Do NOT modify any files outside of this.
let hasLoadedFamilyPlanPaymentsData = false;

function showMessageForm() {
	// making the message form and "Send Message" button visible
  document.getElementById("messageArea").style = "visibility: visible;";
}

function sendMessage() {
	// printing the user-inputted text from the message field to the console.
  let message = document.getElementById("messageField").value;
  console.log(message);
}

function addPizzazz() {
	// change at least three style attributes (e.g. color, font, font-weight, etc.) of the description text 
  let flashSale = document.getElementsByName("flashSale");
  flashSale[0].style.cssText = "color:Tomato; font:bold 29px Arial; border:5px solid Tomato;"
  
  // flashSale[0].style.color = "red";
  // flashSale[0].style.fontWeight = "bolder";
  // flashSale[0].style.fontStyle = "italic";
  // flashSale[0].style.fontSize = "x-large";
}

function saveBalance() {
	// replacing the existing gift card balance with the user-inputted balance
  // accept only rational numbers

  let balanceInput = document.getElementById("balanceInput").value;
  let balance = document.getElementById("balance");
  if (isNaN(balanceInput) || balanceInput.trim().length===0) {
    console.log("Cannot update balance, syntax error!");
  } else {
    balance.innerHTML = parseFloat(balanceInput);
  }

  // const char = /[a-zA-Z]/
  // const specialChar = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/]/
  // const allSpace = /^\s*$/
  // if (char.test(balanceInput) || specialChar.test(balanceInput) || allSpace.test(balanceInput)) {
  //   console.log("Cannot update balance, syntax error!");
  // } else {
  //   balance.innerHTML = balanceInput;
  // }
}

function printBalance() {
	// printing the saved balance to the console in the format `You have {BALANCE_AMOUNT} in your gift card!`
  let savedBalance = document.getElementById("balance").innerHTML;
  console.log("You have %s in your gift card!", savedBalance);
}

function alertBalance() {
	// TODO Complete this function as described by the README.md
  let balance = document.getElementById("balance").innerHTML;
  balance = parseFloat(balance);
  if (balance < 0) {
    alert("We have a special offer for you! Reload your balance now and earn back 10% bonus rewards.");
  } else if (balance >=0 && balance <= 100) {
    alert("Your current balance is " + balance + ". Customers with balance greater than 100 becomes a VIP member and gets a special discount!");
  } else {
    alert("You are our VIP member! You get a 10% discount on every purchase.");
  }
}

function loadFamilyPlanPaymentsData() {

	if (hasLoadedFamilyPlanPaymentsData) {
		return;
	} else {
		hasLoadedFamilyPlanPaymentsData = true;
	}

	let familyPlanPaymentsData = [
		{
			name: "Maria",
			amountDue: 0.00
		},
		{
			name: "Daniel",
			amountDue: 35.57
		},
		{
			name: "Jin",
			amountDue: 5.58
		},
		{
			name: "Ahmad",
			amountDue: 25.91
		}
	];

	// TODO Complete this function as described by the README.md
  let familyPlanTable = document.getElementById("familyPlanAmountDue").getElementsByTagName("tbody")[0];
  for (let i = 0; i < familyPlanPaymentsData.length; i++) {
    let row = familyPlanTable.insertRow();
    let nameCell = row.insertCell();
    let amountCell = row.insertCell();
    let nameText = familyPlanPaymentsData[i]["name"];
    let amountText = familyPlanPaymentsData[i]["amountDue"];
    let nameTextNode = document.createTextNode(nameText);
    let amountTextNode = document.createTextNode(amountText);
    nameCell.appendChild(nameTextNode);
    amountCell.appendChild(amountTextNode);

    if (parseFloat(amountText) > 20) {
      row.style.color = "red";
    }
  }
}

function addOrderRows() {
	// TODO Complete this function as described by the README.md
  let url = "https://cs571.cs.wisc.edu/api/badgershop/orders?amount=4";
  let myOrdersTable = document.getElementById("myOrders").getElementsByTagName("tbody")[0];

  // fetch(url)
  // .then(response => response.json())
  // .then(data => {reveal = data.date + " " + data.productName + " " + data.amount})
  // .catch(error => console.error(error))

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'json';
  request.onload = function() {
    for (var i = 0; i < request.response.length; i++) {
      let row = myOrdersTable.insertRow();
      let dateTextNode = document.createTextNode(request.response[i].date);
      let productTextNode = document.createTextNode(request.response[i].productName);
      let amountTextNode = document.createTextNode(request.response[i].amount);
      row.insertCell().appendChild(dateTextNode);
      row.insertCell().appendChild(productTextNode);
      row.insertCell().appendChild(amountTextNode);

      // for (var x in request.response) {
      //   let cell = row.insertCell();
      //   let cellText = request.response[x];
      //   let cellTextNode = document.createTextNode(cellText);
      //   cell.appendChild(cellTextNode);
      // }
    }
  }
  request.send();
}

function clearOrderRows() {
	// clearing all of the order rows
  let myOrdersTable = document.getElementById("myOrders").getElementsByTagName("tbody")[0];
  myOrdersTable.innerHTML = "";
}

