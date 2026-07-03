/* =========================================================
 * Negombo House Rentals – Static Data Store
 * All house data embedded directly in JavaScript.
 * No server or database needed!
 * ========================================================= */

const HOUSES_DATA = [
  {
    id: 1,
    title: 'DALUWAKOTUWA VILLA',
    price: 995,
    description: 'A beautifully designed modern family house located in a quiet residential area of Negombo. Features spacious rooms, a well-equipped kitchen, private parking, and a lovely garden. Perfect for families looking for comfort and convenience, just 10 minutes from Negombo beach and close to schools, markets, and public transport.',
    bedrooms: 3,
    bathrooms: 2,
    has_kitchen: 1,
    has_parking: 1,
    has_water: 1,
    has_electricity: 1,
    location: 'Negombo, Sri Lanka',
    google_link: 'https://www.google.com/search?kgmid=/g/11y19j47nv&hl=en-LK&q=Indrajithhome&shndl=17&source=sh/x/kp/osrp/m1/2&kgs=56e086c4aa6c7d85&shem=shrtsdl&utm_source=shrtsdl,sh/x/kp/osrp/m1/2',
    thumbnail: 'images/DALUWAKOTUWA VILLA/1.jpg',
    images: [
      { image_url: 'images/DALUWAKOTUWA VILLA/1.jpg', alt_text: 'DALUWAKOTUWA VILLA – View 1' },
      { image_url: 'images/DALUWAKOTUWA VILLA/2.jpg', alt_text: 'DALUWAKOTUWA VILLA – View 2' },
      { image_url: 'images/DALUWAKOTUWA VILLA/3.jpg', alt_text: 'DALUWAKOTUWA VILLA – View 3' },
      { image_url: 'images/DALUWAKOTUWA VILLA/4.jpg', alt_text: 'DALUWAKOTUWA VILLA – View 4' },
      { image_url: 'images/DALUWAKOTUWA VILLA/5.jpg', alt_text: 'DALUWAKOTUWA VILLA – View 5' },
      { image_url: 'images/DALUWAKOTUWA VILLA/6.jpg', alt_text: 'DALUWAKOTUWA VILLA – View 6' },
    ]
  },
  {
    id: 2,
    title: 'KOCHCHIKADE VILLA',
    price: 695,
    description: 'A charming beach-style villa with tropical vibes, located just a short walk from the Negombo coastline. Features natural wooden finishes, open-plan living, and a serene garden. Ideal for couples or small families who love the coastal lifestyle. Enjoy ocean breezes and stunning sunsets from the comfort of your own home.',
    bedrooms: 2,
    bathrooms: 1,
    has_kitchen: 1,
    has_parking: 1,
    has_water: 1,
    has_electricity: 1,
    location: 'Negombo, Sri Lanka',
    google_link: 'https://www.google.lk/search?kgmid=/g/11mkxtwzjr&hl=en-LK&q=Indrajith+Home&shndl=17&source=sh/x/kp/osrp/m1/2&kgs=ae74a70adbd7f374&shem=shrtsdl&utm_source=shrtsdl,sh/x/kp/osrp/m1/2',
    thumbnail: 'images/KOCHCHIKADE VILLA/1.jpg',
    images: [
      { image_url: 'images/KOCHCHIKADE VILLA/1.jpg', alt_text: 'KOCHCHIKADE VILLA – View 1' },
      { image_url: 'images/KOCHCHIKADE VILLA/2.jpg', alt_text: 'KOCHCHIKADE VILLA – View 2' },
      { image_url: 'images/KOCHCHIKADE VILLA/3.jpg', alt_text: 'KOCHCHIKADE VILLA – View 3' },
      { image_url: 'images/KOCHCHIKADE VILLA/4.jpg', alt_text: 'KOCHCHIKADE VILLA – View 4' },
      { image_url: 'images/KOCHCHIKADE VILLA/5.jpg', alt_text: 'KOCHCHIKADE VILLA – View 5' },
      { image_url: 'images/KOCHCHIKADE VILLA/6.jpg', alt_text: 'KOCHCHIKADE VILLA – View 6' },
    ]
  },
  {
    id: 3,
    title: 'PALANGATHURE VILLA',
    price: 995,
    description: "A premium two-story home set in a lush tropical garden in one of Negombo's finest neighborhoods. Featuring 4 spacious bedrooms, 3 modern bathrooms, a gourmet kitchen, and ample parking for multiple vehicles. The expansive garden offers a private retreat with space for outdoor dining and relaxation. Close to international schools and Negombo town centre.",
    bedrooms: 4,
    bathrooms: 3,
    has_kitchen: 1,
    has_parking: 1,
    has_water: 1,
    has_electricity: 1,
    location: 'Negombo, Sri Lanka',
    google_link: 'https://www.google.com/search?kgmid=/g/11ylplh23s&hl=en-LK&q=Indrajith+Home+%231&shndl=17&source=sh/x/kp/osrp/m1/2&kgs=7618554f087b24be&shem=shrtsdl&utm_source=shrtsdl,sh/x/kp/osrp/m1/2',
    thumbnail: 'images/PALANGATHURE VILLA/1.jpg',
    images: [
      { image_url: 'images/PALANGATHURE VILLA/1.jpg', alt_text: 'PALANGATHURE VILLA – View 1' },
      { image_url: 'images/PALANGATHURE VILLA/2.jpg', alt_text: 'PALANGATHURE VILLA – View 2' },
      { image_url: 'images/PALANGATHURE VILLA/3.jpg', alt_text: 'PALANGATHURE VILLA – View 3' },
      { image_url: 'images/PALANGATHURE VILLA/4.jpg', alt_text: 'PALANGATHURE VILLA – View 4' },
      { image_url: 'images/PALANGATHURE VILLA/5.jpg', alt_text: 'PALANGATHURE VILLA – View 5' },
      { image_url: 'images/PALANGATHURE VILLA/6.jpg', alt_text: 'PALANGATHURE VILLA – View 6' },
    ]
  }
];

/**
 * Get all houses.
 */
function getAllHouses() {
  return HOUSES_DATA;
}

/**
 * Get a single house by ID.
 */
function getHouseById(id) {
  return HOUSES_DATA.find(h => h.id === parseInt(id, 10)) || null;
}
