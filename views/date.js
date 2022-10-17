exports.getDate = () => {
  const today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return today.toLocaleDateString("en-US", options);
};

exports.getDay = () => {
  const today = new Date();

  const options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options);
};

// _____longer way of getting the current date _____

//   let currentday = today.getDay();
//   let day = "";

//   switch (currentday) {
//     case 0:
//       day = "Sunday";
//       break;
//     case 1:
//       day = "Monday";
//       break;
//     case 2:
//       day = "Tuesday";
//       break;
//     case 3:
//       day = "Wednesday";
//       break;
//     case 4:
//       day = "Thursday";
//       break;
//     case 5:
//       day = "Friday";
//       break;
//     case 6:
//       day = "Saturday";
//       break;

//     default:
//       console.log("Error: current day is equal to: " + currentday);
//       break;
//   }
