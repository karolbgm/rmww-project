const seedData = [
  {
    name: "Lake Dillon",
    img: "lake-dillon-image.jpg",
    description:
      "A picturesque reservoir surrounded by mountains, offering boating, fishing, and lakeside picnics.",
    location: "Summit County, Colorado",
    activities: ["Boating", "Fishing", "Picnicking"],
    accessibility: "Easy",
    permitRequired: false,
    dogFriendly: true,
    price: 0, // Assuming free access
    rating: 4.6,
  },
  {
    name: "Clear Creek Rafting",
    img: "clear-creek-rafting-image.jpg",
    description:
      "Adventure-filled rafting excursions through Clear Creek's scenic canyons, suitable for various skill levels.",
    location: "Idaho Springs, Colorado",
    activities: ["Rafting", "Hiking"],
    accessibility: "Difficult",
    permitRequired: false,
    dogFriendly: false,
    price: 75, // Cost for rafting tours
    rating: 4.8,
  },
  {
    name: "Grand Lake",
    img: "grand-lake-image.jpg",
    description:
      "Colorado's largest natural lake, perfect for boating, kayaking, and exploring the charming lakeside town.",
    location: "Grand Lake, Colorado",
    activities: ["Boating", "Kayaking", "Exploring Town"],
    accessibility: "Easy",
    permitRequired: false,
    dogFriendly: true,
    price: 0, // Assuming free access
    rating: 4.7,
  },
  {
    name: "Blue Mesa Reservoir",
    img: "blue-mesa-reservoir-image.jpg",
    description:
      "A vast reservoir in the Curecanti National Recreation Area, popular for fishing and water sports.",
    location: "Gunnison, Colorado",
    activities: ["Fishing", "Boating", "Water Sports"],
    accessibility: "Moderate",
    permitRequired: false,
    dogFriendly: true,
    price: 0, // Assuming free access
    rating: 4.5,
  },
  {
    name: "Steamboat Springs Hot Springs",
    img: "steamboat-springs-hot-springs-image.jpg",
    description:
      "Natural hot springs nestled in the mountains, providing a relaxing experience amidst scenic surroundings.",
    location: "Steamboat Springs, Colorado",
    activities: ["Hot Springs", "Hiking"],
    accessibility: "Moderate",
    permitRequired: false,
    dogFriendly: true,
    price: 20, // Cost for hot springs entry
    rating: 4.9,
  },
];

module.exports = seedData;
