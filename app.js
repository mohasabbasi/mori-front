const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

// Function to fetch search results
function fetchSearchResults(searchText) {
    const categories = [];
    const shops = [];

    if (document.getElementById('categoryShirts').checked) categories.push('shirts');
    if (document.getElementById('categoryTops').checked) categories.push('tops');
    if (document.getElementById('categoryShoes').checked) categories.push('shoes');
    if (document.getElementById('categoryTshirts').checked) categories.push('t-shirts');
    if (document.getElementById('shop6thstreet').checked) shops.push('6thstreet');

    const filterParams = {
        category_name: categories.length > 0 ? categories.join(",") : null,
        shop_name: shops.length > 0 ? shops.join(",") : null
    };

    fetch(`https://mori.darkube.app/search/?text=${searchText}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterParams),
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data.results.result);  // Adjusted to match the new response structure
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to display search results
function displayResults(results) {
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        const product = result.payload;
        const productElement = document.createElement('div');
        productElement.className = 'col-sm-6 col-md-4 col-lg-3 mb-4';

        productElement.innerHTML = `
            <div class="product">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">${product.currency} ${product.current_price}</div>
                    <a href="${product.link}" target="_blank" class="btn btn-primary mt-2">View Product</a>
                </div>
            </div>
        `;

        resultsContainer.appendChild(productElement);
    });
}

// Event listener for live search on keyup event
searchInput.addEventListener('keyup', function() {
    const searchText = searchInput.value.trim();
    fetchSearchResults(searchText);
});

// Event listeners for checkbox changes
document.querySelectorAll('.form-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const searchText = searchInput.value.trim();
        fetchSearchResults(searchText);
    });
});
