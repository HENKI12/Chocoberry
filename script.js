/* =========================================
   DATA PRODUK
========================================= */

const products = [

    {
        id: 1,

        name: "Chocoberry",

        price: 35000,

        image: "img/choco.jpeg",

        description:
            "Perpaduan strawberry segar dengan cokelat premium."
    },

    {
        id: 2,

        name: "Chocoberry Kunafa",

        price: 45000,

        image: "img/kunafa.jpeg",

        description:
            "Perpaduan strawberry, cokelat premium dan kunafa renyah."
    },

    {
        id: 3,

        name: "Chocoberry Chewy",

        price: 55000,

        image: "img/chewy.jpeg",

        description:
            "Perpaduan strawberry segar dengan cokelat premium yang creamy, manis dan lezat."
    }



];

function showAppAlert(message) {
    let modal = document.getElementById("app-alert-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "app-alert-modal";
        modal.className = "app-alert-modal";
        modal.setAttribute("role", "alertdialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "app-alert-title");
        modal.innerHTML = `<div class="app-alert-box"><div class="app-alert-icon" aria-hidden="true">!</div><h2 id="app-alert-title">Perhatian</h2><p class="app-alert-message"></p><button type="button" class="app-alert-button">Mengerti</button></div>`;
        document.body.appendChild(modal);
        const close = () => modal.classList.remove("active");
        modal.querySelector(".app-alert-button").addEventListener("click", close);
        modal.addEventListener("click", event => { if (event.target === modal) close(); });
        document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
    }
    modal.querySelector(".app-alert-message").textContent = message;
    modal.classList.add("active");
    modal.querySelector(".app-alert-button").focus();
}


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


   showCartSuccess(product.name);

}

function showCartSuccess(productName) {

    const modal = document.getElementById("cart-success-modal");

    if (!modal) return;

    const message = modal.querySelector(".cart-success-message");

    if (message) {
        message.textContent =
            productName + " berhasil ditambahkan ke keranjang.";
    }

    modal.classList.add("active");

    setTimeout(() => {
        modal.classList.remove("active");
    }, 2500);
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

                    🗑️

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

        showAppAlert(
            "Silakan pilih minimal satu produk."
        );

        return;
    }


    localStorage.setItem(
        "checkoutItems",
        JSON.stringify(selected)
    );

    window.location.href = "checkout.html";
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

        <form class="checkout-box" id="checkout-customer-form" onsubmit="return false;">

            <h3>Data Pemesan</h3>
            <label class="receipt-field">Nama<input name="customerName" required minlength="2" autocomplete="name"></label>
            <label class="receipt-field">Nomor WhatsApp<input name="customerPhone" type="tel" required autocomplete="tel" pattern="(?:\\+?62|0)8[0-9]{7,11}" title="Gunakan nomor Indonesia, misalnya 081234567890"><small>Contoh: 081234567890</small></label>

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

            <fieldset class="payment-methods">
                <legend>Metode Pembayaran</legend>
                <label class="payment-method-option">
                    <input type="radio" name="payment-method" value="transfer" required>
                    <span><strong>Transfer Bank</strong><small>Transfer manual ke rekening toko</small></span>
                </label>
                <label class="payment-method-option">
                    <input type="radio" name="payment-method" value="qris" required>
                    <span><strong>QRIS</strong><small>Bayar dengan aplikasi pembayaran</small></span>
                </label>
                <label class="payment-method-option">
                    <input type="radio" name="payment-method" value="cod" required>
                    <span><strong>Bayar saat diterima</strong><small>Bayar langsung ketika pesanan diterima</small></span>
                </label>
            </fieldset>


            <button
                type="button"
                onclick="pay()"
                class="pay-button">

                Bayar Sekarang

            </button>

        </form>

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

    const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
    if (!selectedPayment) {
        showAppAlert("Silakan pilih metode pembayaran.");
        return;
    }
    const paymentLabels = { transfer: "Transfer Bank", qris: "QRIS", cod: "Bayar saat diterima" };
    const paymentLabel = paymentLabels[selectedPayment.value] || paymentLabels.transfer;
    const customerForm = document.getElementById("checkout-customer-form");
    if (!customerForm) return;
    const nameInput = customerForm.elements.customerName;
    const phoneInput = customerForm.elements.customerPhone;
    if (!nameInput.value.trim() || nameInput.validity.tooShort) {
        showAppAlert(!nameInput.value.trim() ? "Silakan isi nama terlebih dahulu." : "Nama harus terdiri dari minimal 2 karakter.");
        nameInput.focus();
        return;
    }
    if (!phoneInput.value.trim() || phoneInput.validity.patternMismatch) {
        showAppAlert(!phoneInput.value.trim() ? "Silakan isi nomor WhatsApp terlebih dahulu." : "Nomor WhatsApp tidak valid. Gunakan nomor Indonesia, misalnya 081234567890.");
        phoneInput.focus();
        return;
    }
    const customer = {
        name: customerForm.elements.customerName.value.trim(),
        phone: customerForm.elements.customerPhone.value.trim()
    };
    const receipt = {
        number: `CB-${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleString("id-ID"),
        customer,
        paymentMethod: paymentLabel,
        items,
        total: getTotal(items)
    };
    localStorage.setItem("chocoberryLastReceipt", JSON.stringify(receipt));
    const orderDetails = document.getElementById("success-order-details");
    if (orderDetails) orderDetails.textContent = `No. ${receipt.number}\nNama: ${customer.name}\nWhatsApp: ${customer.phone}\nTotal: ${rupiah(receipt.total)}\nMetode pembayaran: ${paymentLabel}`;
    const printButton = document.getElementById("print-receipt-button");
    if (printButton) printButton.hidden = false;
    const whatsappButton = document.getElementById("whatsapp-receipt-button");
    if (whatsappButton) whatsappButton.hidden = false;


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

function printReceipt() {
    const receipt = JSON.parse(localStorage.getItem("chocoberryLastReceipt") || "null");
    if (!receipt) {
        showAppAlert("Informasi struk tidak ditemukan.");
        return;
    }
    const printWindow = window.open("", "chocoberry-receipt", "width=440,height=700");
    if (!printWindow) {
        showAppAlert("Popup cetak diblokir browser. Izinkan popup lalu coba lagi.");
        return;
    }
    const escapeReceiptText = value => String(value).replace(/[&<>\"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
    const rows = receipt.items.map(item => `<div class="item"><strong>${escapeReceiptText(item.name)}</strong><span>${item.quantity} × ${rupiah(item.price)} = ${rupiah(item.price * item.quantity)}</span></div>`).join("");
    printWindow.onafterprint = function () {
        if (window.opener && !window.opener.closed) window.opener.location.href = "index.html";
        printWindow.close();
    };
    printWindow.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Struk ${escapeReceiptText(receipt.number)}</title><style>@page{size:80mm auto;margin:5mm}*{box-sizing:border-box}body{width:70mm;margin:0 auto;color:#332521;font:12px/1.5 Arial,sans-serif}.center{text-align:center}.brand{font-size:20px;font-weight:bold}.muted{color:#725f58}.rule{border:0;border-top:1px dashed #8e7b74;margin:12px 0}.item{display:flex;flex-direction:column;margin:9px 0}.item span{color:#725f58}.total{display:flex;justify-content:space-between;font-size:14px;font-weight:bold}.footer{margin-top:18px;text-align:center}</style></head><body><header class="center"><div class="brand">Chocoberry</div><div class="muted">Sweet & Delicious</div></header><hr class="rule"><div>No. Struk: ${escapeReceiptText(receipt.number)}</div><div>Tanggal: ${escapeReceiptText(receipt.date)}</div><div>Nama: ${escapeReceiptText(receipt.customer.name)}</div><div>WhatsApp: ${escapeReceiptText(receipt.customer.phone)}</div><hr class="rule">${rows}<hr class="rule"><div class="total"><span>Total</span><span>${rupiah(receipt.total)}</span></div><div>Metode: ${escapeReceiptText(receipt.paymentMethod)}</div><p class="footer">Terima kasih telah berbelanja!</p><script>window.onload=function(){setTimeout(function(){window.print()},250)};<\/script></body></html>`);
    printWindow.document.close();
}

function shareReceiptWhatsApp() {
    const receipt = JSON.parse(localStorage.getItem("chocoberryLastReceipt") || "null");
    if (!receipt) {
        showAppAlert("Informasi struk tidak ditemukan.");
        return;
    }
    let recipientPhone = String(receipt.customer.phone || "").replace(/\D/g, "");
    if (recipientPhone.startsWith("0")) recipientPhone = `62${recipientPhone.slice(1)}`;
    if (!/^62[0-9]{8,13}$/.test(recipientPhone)) {
        showAppAlert("Nomor WhatsApp pada struk tidak valid.");
        return;
    }
    const itemLines = receipt.items.map(item =>
        `• ${item.name} x${item.quantity} — ${rupiah(item.price * item.quantity)}`
    );
    const message = [
        "*INVOICE CHOCOBERRY*",
        `No. pesanan: ${receipt.number}`,
        `Tanggal: ${receipt.date}`,
        `Nama: ${receipt.customer.name}`,
        `WhatsApp: ${receipt.customer.phone}`,
        "",
        ...itemLines,
        "",
        `Total: ${rupiah(receipt.total)}`,
        `Metode pembayaran: ${receipt.paymentMethod}`
    ].join("\n");
    const whatsappUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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

/* =========================================
   NAVBAR ACTIVE ON SCROLL
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector(".menu-toggle");
    const siteNavigation = document.getElementById("site-navigation");

    if (menuToggle && siteNavigation) {
        function closeMenu() {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Buka menu");
            siteNavigation.classList.remove("open");
        }

        menuToggle.addEventListener("click", function () {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Buka menu" : "Tutup menu");
            siteNavigation.classList.toggle("open", !isOpen);
        });

        siteNavigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeMenu();
        });

        document.addEventListener("click", event => {
            if (!siteNavigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
        });
    }

    const navLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll(
        "#menu, #kontak, #lokasi"
    );

    function setActiveNav() {

        let current = "menu";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }

        });

    }

    window.addEventListener("scroll", setActiveNav);

    setActiveNav();

});
