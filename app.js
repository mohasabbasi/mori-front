const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results');
const loadingElement = document.getElementById('loading');

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

    // Show loading animation
    loadingElement.style.display = 'block';

    fetch(`https://mori.darkube.app/search/?text=${searchText}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterParams),
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data.results.result);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Hide loading animation
        loadingElement.style.display = 'none';
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
            <div class="card" style="width: 18rem;">
                <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${product.currency} ${product.current_price}</li>
                    <li class="list-group-item">Brand: ${product.brand_name}</li>
                    <li class="list-group-item">Category: ${product.category_name}</li>
                </ul>
                <div class="card-body">
                    <a href="${product.link}" target="_blank" class="card-link">View Product</a>
                </div>
            </div>
        `;

        resultsContainer.appendChild(productElement);
    });
}

// Function to handle search
function handleSearch() {
    const searchText = searchInput.value.trim();
    fetchSearchResults(searchText);
}

// Event listener for search button click
searchButton.addEventListener('click', handleSearch);

// Event listener for pressing Enter in the search input
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Event listeners for checkbox changes
document.querySelectorAll('.form-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const searchText = searchInput.value.trim();
        fetchSearchResults(searchText);
    });
});
