// Products data array for filling in info box
var productsData = [];
var shoppingCartItems = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Open shopping cart
    $('#shopping-cart-counter').on('click', openShoppingCart);
    $('#shopping-cart').hide();

    $('#shopping-cart-items table tbody').on('click', 'td a.deleteFromCart', deleteShoppingCartItem);

    $('#product-list table tbody').on('click', 'td a.addToShopCart', addToShopCart);

    // Fill the product table on initial page load
    fillProducts();

});

// Functions =============================================================

function openShoppingCart() {

    var tableContent = ''; // Empty content string

    // jQuery AJAX call for JSON
    $.getJSON( '/shoppingcart/items', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.product_id + '</td>';
            tableContent += '<td>' + this.amount + '</td>';
            tableContent += '<td><a href="#" class="deleteFromCart" rel="' + this._id + '">Delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#shopping-cart-items table tbody').html(tableContent);
        shoppingCartItems = data;
        $('#shopping-cart').dialog();
    });
};

// Fill table with data
function fillProducts() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/products/list', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '<td><a href="#" class="addToShopCart" rel="' + this._id + '">Buy</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#product-list table tbody').html(tableContent);
        productsData = data;
    });
};

// Delete Shopping cart item
function deleteShoppingCartItem(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this shopping cart item?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/shoppingcart/delete/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            fillProducts();
            $('#shopping-cart').dialog('close');
        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

function addToShopCart(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newCartItem = {
            'product_id': $(this).attr('rel'),
            'amount': '1'
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newCartItem,
            url: '/shoppingcart/addtocart',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

               fillProducts();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};
