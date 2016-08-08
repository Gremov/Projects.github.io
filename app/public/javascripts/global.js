// Products data array for filling in info box
var productsData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Add Product button click
    $('#btnAddProduct').on('click', addProduct);

    // Delete User link click
    $('#product-list table tbody').on('click', 'td a.linkdeleteproduct', deleteProduct);

    // start the update user process
    $('#product-list table tbody').on('click', 'td a.linkupdateproduct', changeProductInfo);

    // Add class to updated fields
    $('#updateProduct input').on('change', function(){$(this).addClass('updated')});

    // Update Product button click
    $('#btnUpdateProduct').on('click', updateProduct);

    // Fill the product table on initial page load
    fillProducts();
});

// Functions =============================================================

// Fill table with data
function fillProducts() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/products/list', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.productname + '</td>';
            tableContent += '<td>' + this.productprice + '</td>';
            tableContent += '<td>' + this.productstockamount + '</td>';
            // tableContent += '<td><a href="#" class="linkdeleteproduct" rel="' + this._id + '">delete</a>/<a href="#" class="linkupdateproduct" rel="' + this._id + '">update</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteproduct" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#product-list table tbody').html(tableContent);

        // Stick our product data array into a productlist variable in the global object
        productsData = data;
    });
};

// Add Product
function addProduct(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all product info into one object
        var newProduct = {
            'productname': $('#addProduct fieldset input#inputProductName').val(),
            'productprice': $('#addProduct fieldset input#inputProductPrice').val(),
            'productstockamount': $('#addProduct fieldset input#inputProductStockAmount').val(),
        };

        // Use AJAX to post the object to our addproduct service
        $.ajax({
            type: 'POST',
            data: newProduct,
            url: '/products/addproduct',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addProduct fieldset input').val('');

                // Update the table
                fillProducts();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            };
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    };
};

// put Product Info into the 'Update Product Panel'
function changeProductInfo(event) {
    event.preventDefault();

    // If the addProduct panel is visible, hide it and show updateProduct panel
    if($('#addProductPanel').is(":visible")){
        togglePanels();
    }

    // Get Index of object based on _id value
    var _id = $(this).attr('rel');
    var arrayPosition = productsData.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);

    // Get our Product Object
    var thisProductObject = productsData[arrayPosition];

    // Fill Info Box
    $('#updateProductName').val(thisProductObject.productname);
    $('#updateProductPrice').val(thisProductObject.productprice);
    $('#updateProductStockAmount').val(thisProductObject.amount);

    // Put the productID into the REL of the 'update product' block
    $('#updateProduct').attr('rel',thisProductObject._id);
};

// PUT to updateproduct

function updateProduct(event){
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to update this product?');

    // Check and make sure the product confirmed
    if (confirmation === true) {
        // If they did, do our update
        //set the _id of the product to be update
        var _id = $(this).parentsUntil('div').parent().attr('rel');

        //create a collection of the updated fields
        var fieldsToBeUpdated = $('#updateProduct input.updated');

        //create an object of the pairs
        var updatedFields = {};
        $(fieldsToBeUpdated).each(function(){
            var key = $(this).attr('placeholder').replace(" ","").toLowerCase();
            var value = $(this).val();
            updatedFields[key]=value;
        })

        // do the AJAX
        $.ajax({
            type: 'PUT',
            url: '/products/updateproduct/' + _id,
            data: updatedFields
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
                togglePanels();
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            fillProducts();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};

// Delete Product
function deleteProduct(event) {
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this product?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/products/deleteproduct/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            // Update the table
            fillProducts();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};

// Toggle addProduct and updateProduct panels
function togglePanels(){
    $('#addProductPanel').toggle();
    $('#updateProductPanel').toggle();
};