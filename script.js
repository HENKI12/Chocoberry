/* =========================================
   DATA PRODUK
========================================= */

const products = [

    {
        id: 1,

        name: "Chocoberry",

        price: 25000,

        image: "img/choco.jpeg",

        description:
            "Perpaduan strawberry segar dengan cokelat premium."
    },

    {
        id: 2,

        name: "Chocoberry Kunafa",

        price: 30000,

        image: "img/kunafa.jpeg",

        description:
            "Perpaduan strawberry, cokelat premium dan kunafa renyah."
    }

];


/* =========================================
   LOAD CART
========================================= */

let cart =
    JSON.parse(
        localStorage.getItem(
            "chocoberryCart"
        )
    ) || [];


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "chocoberryCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   FORMAT RUPIAH
========================================= */

function rupiah(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(value);

}


/* =========================================
   CART COUNT
========================================= */

function updateCartCount() {

    const element =
        document.getElementById(
            "cart-count"
        );


    if (!element) return;


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    element.textContent = total;

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(id) {

    const product =
        products.find(
            product => product.id === id
        );


    if (!product) return;


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1,

            selected: false

        });

    }


    saveCart();

    updateCartCount();


    alert(
        product.name +
        " berhasil ditambahkan ke keranjang."
    );

}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(
            item => item.id === id
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================
   REMOVE PRODUCT
========================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================
   SELECT PRODUCT
========================================= */

function toggleProduct(id) {

    const item =
        cart.find(
            item => item.id === id
        );


    if (!item) return;


    item.selected =
        !item.selected;


    saveCart();

    renderCart();

}


/* =========================================
   GET SELECTED
========================================= */

function selectedItems() {

    return cart.filter(
        item => item.selected
    );

}


/* =========================================
   TOTAL
========================================= */

function getTotal(items) {

    return items.reduce(
        (total, item) => {

            return total +
                item.price *
                item.quantity;

        },
        0
    );

}


/* =========================================
   RENDER CART
========================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cart-container"
        );


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-box">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>
                    Keranjang masih kosong
                </h3>

                <p>
                    Yuk pilih produk favoritmu.
                </p>

                <a
                    href="index.html"
                    class="primary-button">

                    Lihat Menu

                </a>

            </div>

        `;

        return;
    }


    let html = "";


    cart.forEach(item => {

        html += `

            <div class="cart-item">

                <input
                    type="checkbox"

                    class="cart-checkbox"

                    ${item.selected ? "checked" : ""}

                    onchange="
                        toggleProduct(${item.id})
                    "
                >


                <div class="cart-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="cart-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${rupiah(item.price)}
                    </p>

                </div>


                <div class="quantity">

                    <button
                        onclick="
                            changeQuantity(
                                ${item.id},
                                -1
                            )
                        ">

                        −

                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        onclick="
                            changeQuantity(
                                ${item.id},
                                1
                            )
                        ">

                        +

                    </button>

                </div>


                <button
                    class="remove-button"

                    onclick="
                        removeFromCart(
                            ${item.id}
                        )
                    ">

                    🗑

                </button>

            </div>

        `;

    });


    const selected =
        selectedItems();


    const total =
        getTotal(selected);


    html += `

        <div class="cart-summary">

            <div>

                <small>
                    Total produk dipilih
                </small>

                <strong>
                    ${rupiah(total)}
                </strong>

            </div>


            <button
                onclick="checkout()"
                class="checkout-button">

                Checkout

            </button>

        </div>

    `;


    container.innerHTML = html;

}


/* =========================================
   CHECKOUT
========================================= */

function checkout() {

    const selected =
        selectedItems();


    if (selected.length === 0) {

        alert(
            "Silakan pilih minimal satu produk."
        );

        return;
    }


    localStorage.setItem(
        "checkoutItems",
        JSON.stringify(selected)
    );


    window.location.href =
        "checkout.html";

}


/* =========================================
   RENDER CHECKOUT
========================================= */

function renderCheckout() {

    const container =
        document.getElementById(
            "checkout-container"
        );


    if (!container) return;


    const items =
        JSON.parse(
            localStorage.getItem(
                "checkoutItems"
            )
        ) || [];


    if (items.length === 0) {

        container.innerHTML = `

            <div class="empty-box">

                <div class="empty-icon">
                    🛍️
                </div>

                <h3>
                    Tidak ada pesanan
                </h3>

                <p>
                    Silakan pilih produk dari keranjang.
                </p>

                <a
                    href="keranjang.html"
                    class="primary-button">

                    Kembali ke Keranjang

                </a>

            </div>

        `;

        return;
    }


    let html = `

        <div class="checkout-box">

            <h3>
                Ringkasan Pesanan
            </h3>

    `;


    items.forEach(item => {

        const subtotal =
            item.price *
            item.quantity;


        html += `

            <div class="checkout-item">

                <div class="checkout-product">

                    <div class="checkout-thumb">
                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >
                    </div>

                    <div class="checkout-name">

                        <strong>
                            ${item.name}
                        </strong>

                        <br>

                        <small>
                            ${item.quantity} ×
                            ${rupiah(item.price)}
                        </small>

                    </div>

                </div>


                <div class="checkout-price">

                    ${rupiah(subtotal)}

                </div>

            </div>

        `;

    });


    const total =
        getTotal(items);


    html += `

            <div class="checkout-total">

                <strong>
                    Total Pembayaran
                </strong>

                <strong>
                    ${rupiah(total)}
                </strong>

            </div>


            <button
                onclick="pay()"
                class="pay-button">

                Bayar Sekarang

            </button>

        </div>

    `;


    container.innerHTML = html;

}


/* =========================================
   PAYMENT
========================================= */

function pay() {

    const items =
        JSON.parse(
            localStorage.getItem(
                "checkoutItems"
            )
        ) || [];


    if (items.length === 0) return;


    const ids =
        items.map(
            item => item.id
        );


    cart =
        cart.filter(
            item => !ids.includes(item.id)
        );


    saveCart();

    updateCartCount();


    localStorage.removeItem(
        "checkoutItems"
    );


    const modal =
        document.getElementById(
            "success-modal"
        );


    if (modal) {

        modal.classList.add("active");

    }

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "success-modal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    window.location.href =
        "index.html";

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        renderCart();

        renderCheckout();

    }
);