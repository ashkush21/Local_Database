let { LocalStore } = require("./data_store/store");
let database;

checkRead = () => {
  const key = "6";
  const obj = database.readElement(key);
  if (obj.errMessage.message.length) {
    console.log(obj.errMessage.message);
  } else {
    console.log(obj.data);
  }
};

checkCreate = () => {
  const key = "5";
  const value = {
    name: "mikasa",
    roll_number: "45645",
  };
  const timeToLive = 10;

  let obj = database.createElement(key, value, timeToLive);
  if (obj.errMessage.message.length) {
    console.log(obj.errMessage.message);
    console.log(obj.errMessage.systemMessage);
  } else {
    console.log("Element created successfully");
  }
};

checkDelete = () => {
  const key = "6";
  const obj = database.deleteElement(key);
  if (obj.errMessage.message.length) {
    console.log(obj.errMessage.message);
    console.log(obj.errMessage.systemMessage);
  } else {
    console.log("Element deleted successfully");
  }
};

initialFunction = () => {
  const newFilePath = "./data_store/db.json";
  database = new LocalStore(newFilePath);
  //   database = new LocalStore();
  //   checkCreate();
  //   checkRead();
  //   checkDelete();
};

initialFunction();
