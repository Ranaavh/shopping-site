$(document).ready(function() {
    // Image zoom functionality
    function changeImage() {
        var imageSrc = $(this).attr('src');
        $('#enlarged-image').attr('src', imageSrc);
        $('#zoom-img').attr('src', imageSrc); // Update zoomed image source
    }

    $('.thumbnail').on('click', changeImage);
    $('.thumbnail').on('mouseenter', changeImage);

    // Add zoom effect
    $('#enlarged-image').on('mouseenter', function() {
        $('.zoomed-in-area').show();
    });

    $('#enlarged-image').on('mouseleave', function() {
        $('.zoomed-in-area').hide();
    });

    $('#enlarged-image').on('mousemove', function(e) {
        var zoomArea = $('.zoomed-in-area');
        var zoomImg = $('#zoom-img');

        var imageOffset = $(this).offset();
        var relX = e.pageX - imageOffset.left;
        var relY = e.pageY - imageOffset.top;

        var zoomWidth = zoomArea.width();
        var zoomHeight = zoomArea.height();

        var zoomImgWidth = zoomImg.width();
        var zoomImgHeight = zoomImg.height();

        var zoomX = (relX / $(this).width()) * zoomImgWidth - zoomWidth / 2;
        var zoomY = (relY / $(this).height()) * zoomImgHeight - zoomHeight / 2;

        zoomImg.css({
            left: -zoomX,
            top: -zoomY
        });
    });

    // Form switching functionality
    const loginForm = $('.login-form');
    const signupForm = $('.signup-form');
    const showSignup = $('#show-signup');
    const showLogin = $('#show-login');

    showSignup.on('click', function() {
        loginForm.removeClass('active');
        signupForm.addClass('active');
    });

    showLogin.on('click', function() {
        signupForm.removeClass('active');
        loginForm.addClass('active');
    });

    loginForm.addClass('active'); // Show the login form by default

    $('.add-to-cart-btn').on('click', function() {
        const name = $(this).data('name');
        const quantity = parseInt($(this).data('quantity'));
        const price = parseFloat($(this).data('price'));
        const image = $(this).data('image');

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItemIndex = cart.findIndex(item => item.name === name);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name, quantity, price, image });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        alert(`${name} has been added to your cart`);
    });

    // Load Cart
    function loadCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = $('#billing-table tbody');
        cartItemsContainer.empty();

        let subtotal = 0;

        cart.forEach((item, index) => {
            const total = item.quantity * item.price;
            subtotal += total;

            cartItemsContainer.append(`
                <tr data-index="${index}">
                    <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                    <td>${item.name}</td>
                    <td>
                        <button class="decrease-quantity">-</button>
                        ${item.quantity}
                        <button class="increase-quantity">+</button>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${total.toFixed(2)}</td>
                    <td><button class="remove-item">Remove</button></td>
                </tr>
            `);
        });

        const tax = subtotal * 0.10;
        const grandtotal = subtotal + tax;

        $('#subtotal').val(subtotal.toFixed(2));
        $('#tax').val(tax.toFixed(2));
        $('#grandtotal').val(grandtotal.toFixed(2));
    }

    if (window.location.pathname.endsWith('cart.html')) {
        loadCart();
    }

    // Increase Quantity
    $(document).on('click', '.increase-quantity', function() {
        const index = $(this).closest('tr').data('index');
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    });

    // Decrease Quantity
    $(document).on('click', '.decrease-quantity', function() {
        const index = $(this).closest('tr').data('index');
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        }
    });

    // Remove Item
    $(document).on('click', '.remove-item', function() {
        const index = $(this).closest('tr').data('index');
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    });
});
