// Exemple de données de merch (vous pouvez remplacer cela par une base de données en backend)
const merchItems = [
    { id: 1, name: "Album M_X", price: 11.99 },
    // Ajoutez d'autres articles ici
];

// Variables globales
let cartItems = [];
const mainElement = document.querySelector("main");

// Fonction pour afficher les articles de merch
function displayMerchandise() {
    const merchandiseSection = document.createElement('div');

    // Parcours des articles de merch
    for (const item of merchItems) {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <!-- Ajout de la vidéo en dessous du nom avec la classe preview-video -->
            <video class="preview-video" loop autoplay>
                <source src="src/CD_PREVIEW.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p>Prix: ${item.price} €</p>
            <label for="quantity-${item.id}">Quantité:</label>
            <select id="quantity-${item.id}">
                ${generateQuantityOptions()}
            </select>
            <button onclick="addToCart(${item.id})">Ajouter au panier</button>
        `;
        merchandiseSection.appendChild(itemElement);
    }
    mainElement.appendChild(merchandiseSection);
}

// Fonction pour générer les options de quantité dans la liste déroulante
function generateQuantityOptions(selectedQuantity = 0) {
    let options = '';
    for (let i = 0; i <= 10; i++) {
        options += `<option value="${i}" ${selectedQuantity === i ? "selected" : ""}>${i}</option>`;
    }
    return options;
}

// Fonction pour afficher/masquer le panier
function toggleCart() {
    const shoppingCart = document.getElementById("shopping-cart");
    shoppingCart.classList.toggle("active");
}

// Appel à la fonction pour charger la page d'accueil au chargement de la page
window.onload = function () {
    // Charger la page d'accueil ou une autre page par défaut
    loadHomePage();

    // Vous pouvez également lancer la lecture de la vidéo ici si vous le souhaitez
    const video = document.querySelector('video');
    if (video) {
        video.play();
    }
};

// Fonction pour charger le contenu de la page Accueil
function loadHomePage() {
    mainElement.innerHTML = `
        <!-- Espace pour afficher la vidéo YouTube -->
        <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/viiR7GJtYYo" frameborder="0" allowfullscreen></iframe>
        </div>
    `;
}

// Fonction pour charger le contenu de la page Merchandise
function loadMerchandisePage() {
    mainElement.innerHTML = ""; // Clear the main content first

    // Call the function to display the merchandise items
    displayMerchandise();
}

// Fonction pour charger le contenu de la page Panier
function loadShoppingCartPage() {
    mainElement.innerHTML = ""; // Clear the main content first

    // Call the function to display the cart items
    displayCartItems();
}

// Fonction pour afficher les articles du panier
function displayCartItems() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = ""; // Clear the cart items section first

    let totalPrice = 0;
    for (const cartItem of cartItems) {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = `
            <p>${cartItem.name} - ${cartItem.price} €</p>
            <label for="quantity-${cartItem.id}">Quantité:</label>
            <select id="quantity-${cartItem.id}" data-id="${cartItem.id}" onchange="updateCartItemQuantity(${cartItem.id}, this.value)">
                ${generateQuantityOptions(cartItem.quantity)}
            </select>
            <button onclick="removeFromCart(${cartItem.id})">Supprimer</button>
        `;
        cartItemsDiv.appendChild(itemElement);
        totalPrice += cartItem.price * cartItem.quantity;
    }

    // Mettre à jour le total du panier
    const cartTotalElement = document.getElementById("cart-total");
    cartTotalElement.innerText = totalPrice;
}

// Fonction pour mettre à jour la quantité d'un article dans le panier
function updateCartItemQuantity(itemId, newQuantity) {
    const parsedQuantity = parseInt(newQuantity);
    if (!isNaN(parsedQuantity)) {
        const existingCartItem = cartItems.find((cartItem) => cartItem.id === itemId);
        if (existingCartItem) {
            existingCartItem.quantity = parsedQuantity;
            if (parsedQuantity <= 0) {
                removeFromCart(itemId);
                return;
            }
            displayCartItems(); // Update the cart items display
        }
    }
}

// Fonction pour recalculer le total du panier
function calculateCartTotal() {
    let totalPrice = 0;
    for (const cartItem of cartItems) {
        totalPrice += cartItem.price * cartItem.quantity;
    }
    const cartTotalElement = document.getElementById("cart-total");
    cartTotalElement.innerText = totalPrice;
}

// Fonction pour ajouter un article au panier avec une quantité spécifiée
function addToCart(itemId) {
    const itemToAdd = merchItems.find((item) => item.id === itemId);
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    const quantity = parseInt(quantityElement.value);

    if (itemToAdd && quantity > 0) {
        const existingCartItem = cartItems.find((cartItem) => cartItem.id === itemId);
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            cartItems.push({ ...itemToAdd, quantity });
        }
        displayCartItems(); // Update the cart items display
    }
}

// Fonction pour retirer un article du panier
function removeFromCart(itemId) {
    cartItems = cartItems.filter((item) => item.id !== itemId);
    displayCartItems(); // Update the cart items display
}

// Fonction pour effectuer le paiement (simulé dans cet exemple)
function checkout() {
    alert("Paiement effectué avec succès !");
    // Ici, vous pouvez implémenter la logique de paiement réel via une passerelle de paiement
    // et vider le panier après le paiement.
}

// Fonction pour effectuer le paiement avec PayPal
function checkoutWithPayPal() {
    fetch("/my-server/create-paypal-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // Utiliser le "body" pour passer les informations de la commande
        body: JSON.stringify({
            cart: cartItems.map(item => ({
                sku: `MERCH-${item.id}`,
                quantity: item.quantity,
            })),
        }),
    })
        .then((response) => response.json())
        .then((order) => {
            // Utiliser l'ID de commande retourné pour créer un bouton PayPal
            paypal.Buttons({
                createOrder(data, actions) {
                    return order.id;
                },
                // ...
            }).render('#paypal-button-container');
        });
}

// Appel à la fonction pour charger la page d'accueil au chargement de la page
loadHomePage();
