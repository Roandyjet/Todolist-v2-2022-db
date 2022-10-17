const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

// to import date from date module
const date = require(__dirname + "/views/date.js");
let day = date.getDay();

// to build communication with ejs file
app.set("view engine", "ejs");

// built in bodyparser within express
app.use(express.urlencoded({ extended: true }));

// to be able to use CSS
app.use(express.static(__dirname + "/public"));

// Create a new db inside mongodb
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/todolistDB");

  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const itemsSchema = new mongoose.Schema({
  name: String,
});

// mongoose models are always capitalised (Item). The db will change the name of the collection in plural.
const Item = mongoose.model("Item", itemsSchema);

// creating documents from the model which are the default items in the db.
const item1 = new Item({
  name: "Welcome to your todolist",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<<<  Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];
// now we can insert these items in the items collectoin using insertMany()

// new schema for the custom list.

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

// Create a new model from listSchema
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  // find all documents; returns an array
  Item.find({}, (err, foundItems) => {
    // when it returns an array, we need to use .length
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        // route: req.url,
        listTitle: "today",
        newListItems: foundItems,
      });
    }
  });
});

app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  let listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      if (!err) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  // findOne returns an object
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      // it is not an array so it is not appropriate to use .length
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        // Show an existing list.
        res.render("list", {
          // route: req.url,
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

// ---------------wrong
// app.post("/:customListName", (req, res) => {
//   let listName = req.body.newItem;

//   const newList = new List({
//     name: listName,
//   });

//   newList.save();

//   res.redirect("/" + listName);
// });

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "today") {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
