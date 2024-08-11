function removeFromCart(id) {
    fetch('/remove-from-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert('Error removing product from cart');
        }
    });
}