let orderData = {
    table: selectedTableNumber,
    item: selectedItemName,
    description: selectedItemDescription,
    price: selectedItemPrice
};

fetch("https://script.google.com/macros/s/AKfycbyO2PJch9_-Y7lQKPCR67Ea8Dhy3S7JijaaCou3o4D9MA4g--CP4Byn4TcJekgYiQCv/exec", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
})
.then(response => response.json())
.then(data => {
    if (data.status === "success") {
        document.getElementById("order-popup").style.display = "block";
        setTimeout(() => {
            document.getElementById("order-popup").style.display = "none";
        }, 3000);
    }
})
.catch(error => {
    console.error("Error sending order:", error);
});
