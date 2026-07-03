/* =========================================================
 * Negombo House Rentals – Houses Listing Logic
 * Reads from embedded data (data.js) – no server needed.
 * ========================================================= */

/**
 * Load featured houses on the Home page.
 */
function loadFeaturedHouses() {
    const grid = document.getElementById('featuredHouses');
    if (!grid) return;

    const houses = getAllHouses();
    grid.innerHTML = houses.map(house => createHouseCard(house)).join('');
}

/**
 * Load all houses on the Houses listing page.
 */
function loadHousesListing() {
    const grid = document.getElementById('housesGrid');
    if (!grid) return;

    const houses = getAllHouses();
    if (houses.length === 0) {
        grid.innerHTML = `<p style="text-align:center; color:var(--text-light); grid-column: 1/-1;">No properties available at the moment.</p>`;
        return;
    }
    grid.innerHTML = houses.map(house => createHouseCard(house)).join('');
}
