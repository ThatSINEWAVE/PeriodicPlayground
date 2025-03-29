document.addEventListener('DOMContentLoaded', function() {
    let elements = [];

    // Load elements data from JSON file
    fetch('elements.json')
        .then(response => response.json())
        .then(data => {
            elements = data;
            initElementsList();
        })
        .catch(error => {
            console.error('Error loading elements data:', error);
            elements = [];
            initElementsList();
        });

    const elementsList = document.getElementById('elementsList');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const categorySelect = document.getElementById('categorySelect');
    const stateButtons = document.querySelectorAll('.state-btn');
    const elementModal = document.getElementById('elementModal');
    const closeModal = document.getElementById('closeModal');

    // Element detail elements
    const detailName = document.getElementById('detailName');
    const detailSymbol = document.getElementById('detailSymbol');
    const detailNumber = document.getElementById('detailNumber');
    const detailMass = document.getElementById('detailMass');
    const detailCategory = document.getElementById('detailCategory');
    const detailState = document.getElementById('detailState');
    const detailElectronConfig = document.getElementById('detailElectronConfig');
    const detailDescription = document.getElementById('detailDescription');
    const detailDiscovery = document.getElementById('detailDiscovery');
    const detailUses = document.getElementById('detailUses');
    const detailFunFact = document.getElementById('detailFunFact');
    const detailSymbolBox = document.getElementById('detailSymbolBox');

    // Current filters
    let currentSearch = '';
    let currentCategory = 'all';
    let currentState = 'all';

    // Initialize the elements list
    function initElementsList() {
        // Clear the list
        elementsList.innerHTML = '';

        // Sort elements by atomic number
        const sortedElements = [...elements].sort((a, b) => a.number - b.number);

        // Create cards for each element
        sortedElements.forEach(element => {
            const elementCard = document.createElement('div');
            elementCard.className = 'element-card';
            elementCard.dataset.number = element.number;

            elementCard.innerHTML = `
                <div class="element-symbol-container ${element.category}">
                    <span class="element-symbol">${element.symbol}</span>
                    <span class="element-number">${element.number}</span>
                </div>
                <div class="element-info">
                    <div class="element-name">${element.name}</div>
                    <div class="element-category">${getCategoryName(element.category)}</div>
                    <span class="element-state">${capitalizeFirstLetter(element.state)}</span>
                </div>
            `;

            elementsList.appendChild(elementCard);
        });

        // Add event listeners to all cards
        document.querySelectorAll('.element-card').forEach(card => {
            card.addEventListener('click', function() {
                const elementNumber = parseInt(this.dataset.number);
                showElementDetails(elementNumber);
            });
        });
    }

    // Filter elements based on current filters
    function filterElements() {
        const elementsToShow = document.querySelectorAll('.element-card');

        elementsToShow.forEach(card => {
            const elementNumber = parseInt(card.dataset.number);
            const elementData = elements.find(el => el.number === elementNumber);

            let matchesSearch = true;
            let matchesCategory = true;
            let matchesState = true;

            // Check search filter
            if (currentSearch) {
                matchesSearch = (
                    elementData.name.toLowerCase().includes(currentSearch) ||
                    elementData.symbol.toLowerCase().includes(currentSearch) ||
                    elementData.number.toString().includes(currentSearch)
                );
            }

            // Check category filter
            if (currentCategory !== 'all') {
                matchesCategory = (elementData.category === currentCategory);
            }

            // Check state filter
            if (currentState !== 'all') {
                matchesState = (elementData.state === currentState);
            }

            // Show or hide element based on filters
            if (matchesSearch && matchesCategory && matchesState) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Show element details
    function showElementDetails(elementNumber) {
        const element = elements.find(el => el.number === elementNumber);
        if (!element) return;

        // Update detail elements
        detailName.textContent = element.name;
        detailSymbol.textContent = element.symbol;
        detailNumber.textContent = element.number;
        detailMass.textContent = element.mass;
        detailCategory.textContent = getCategoryName(element.category);
        detailState.textContent = capitalizeFirstLetter(element.state);
        detailElectronConfig.textContent = element.electronConfig;

        // Description with more details
        detailDescription.innerHTML = `
            <p>${element.name} (${element.symbol}) is a ${element.state} ${getCategoryName(element.category)}
            with atomic number ${element.number} and atomic mass ${element.mass}.</p>
        `;

        detailDiscovery.textContent = element.discovery;
        detailUses.textContent = element.uses;
        detailFunFact.textContent = element.funFact;

        // Update symbol box style
        detailSymbolBox.className = `element-symbol-box ${element.category}`;

        // Show modal
        elementModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Highlight selected element
        const elementCard = document.querySelector(`.element-card[data-number="${elementNumber}"]`);
        if (elementCard) {
            elementCard.classList.add('element-selected');
            setTimeout(() => {
                elementCard.classList.remove('element-selected');
            }, 300);
        }
    }

    // Close modal
    function closeModalHandler() {
        elementModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Helper function to get category name
    function getCategoryName(category) {
        const names = {
            alkali: 'alkali metal',
            alkaline: 'alkaline earth metal',
            transition: 'transition metal',
            basic: 'basic metal',
            semimetal: 'metalloid',
            nonmetal: 'nonmetal',
            halogen: 'halogen',
            noble: 'noble gas',
            lanthanide: 'lanthanide',
            actinide: 'actinide'
        };
        return names[category] || category;
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        clearSearch.style.display = currentSearch ? 'block' : 'none';
        filterElements();
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        clearSearch.style.display = 'none';
        filterElements();
    });

    categorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        filterElements();
    });

    stateButtons.forEach(button => {
        button.addEventListener('click', () => {
            stateButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentState = button.dataset.state;
            filterElements();
        });
    });

    closeModal.addEventListener('click', closeModalHandler);

    // Close modal when clicking outside
    elementModal.addEventListener('click', (e) => {
        if (e.target === elementModal) {
            closeModalHandler();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elementModal.classList.contains('active')) {
            closeModalHandler();
        }
    });
});