const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedhelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random100 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "64b2607411c0ff8284e81ff9",
      location: `${cities[random100].city}, ${cities[random100].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque delectus laborum sint autem dolores rerum exercitationem libero recusandae sapiente aut deleniti sit quos officia alias, quaerat ad eum obcaecati suscipit!",
      price: price,
      image: [
        {
          url: "https://res.cloudinary.com/dz1m3zy4c/image/upload/v1689927044/YelpCamp/ohiva8yvwptnq1eckuxq.jpg",
          filename: "YelpCamp/ohiva8yvwptnq1eckuxq",
        },
        {
          url: "https://res.cloudinary.com/dz1m3zy4c/image/upload/v1689927045/YelpCamp/bjx5g59ut2k2xjr9itpm.jpg",
          filename: "YelpCamp/bjx5g59ut2k2xjr9itpm",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
