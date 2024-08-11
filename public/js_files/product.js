function addToCart(id, name, description, price) {
    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, description, price }),
    }).then(response => {
        if (response.ok) {
            alert('Product added to cart');
        } else {
            alert('Error adding product to cart');
        }
    });
}