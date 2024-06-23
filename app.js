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

    fetch(`http://0.0.0.0:8000/search/?text=${searchText}`, {
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

        // Create card element
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.style = 'width: 18rem;';

        // Card image
        const img = document.createElement('img');
        img.src = product.images[0];
        img.className = 'card-img-top';
        img.alt = product.name;
        card.appendChild(img);

        // Card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = product.name;
        cardBody.appendChild(title);

        const description = document.createElement('p');
        description.className = 'card-text';
        description.textContent = product.description;
        cardBody.appendChild(description);

        // List group for details
        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group list-group-flush';

        const priceItem = document.createElement('li');
        priceItem.className = 'list-group-item';
        priceItem.textContent = `Price: ${product.currency} ${product.current_price}`;
        listGroup.appendChild(priceItem);

        const oldPriceItem = document.createElement('li');
        oldPriceItem.className = 'list-group-item';
        oldPriceItem.textContent = `Old Price: ${product.currency} ${product.old_price} (${product.off_percent}% off)`;
        listGroup.appendChild(oldPriceItem);

        // Link
        const linkDiv = document.createElement('div');
        linkDiv.className = 'card-body';

        const link = document.createElement('a');
        link.href = product.link;
        link.className = 'card-link';
        link.textContent = 'View Product';
        link.target = '_blank';
        linkDiv.appendChild(link);

        card.appendChild(cardBody);
        card.appendChild(listGroup);
        card.appendChild(linkDiv);

        resultsContainer.appendChild(card);
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
