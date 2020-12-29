let fs = require("fs");

class LocalStore {
  filePath = "./db.json";

  constructor(newFilePath) {
    if (newFilePath) this.filePath = newFilePath;
  }

  createElement = (key, value, timetolive) => {
    const allData = this.readWholeFile();
    let error = { message: "", systemMessage: "" };
    const isKeyPresent = allData.filter((data) => data.key === key);
    if (!timetolive) {
      timetolive = -1;
    } else {
      timetolive = timetolive + Math.floor(Date.now() / 1000);
    }
    if (isKeyPresent.length) {
      error.message = "Data already exists for the corresponding key";
    } else {
      allData.push({ key: key, value: value, timeToLive: timetolive });
      const finalData = JSON.stringify(allData);
      fs.writeFileSync(this.filePath, finalData, (err) => {
        if (err) {
          error.message = "An error occured while inserting the data";
          error.value = err;
        }
      });
    }
    return { data: null, errMessage: error };
  };

  deleteElement = (key) => {
    const allData = this.readWholeFile();
    const isKeyPresent = allData.filter((data) => data.key === key);
    let error = { message: "", systemMessage: "" };

    if (isKeyPresent.length) {
      if (isKeyPresent[0].timeToLive <= Math.floor(Date.now() / 1000)) {
        error.message = "This key is expired and cannot be deleted";
      } else {
        let dataAfterDelete = allData.filter((data) => data.key !== key);
        dataAfterDelete = JSON.stringify(dataAfterDelete);
        fs.writeFileSync(this.filePath, dataAfterDelete, (err) => {
          if (err) {
            error.message = "An error occured while deleting an element";
            error.value = err;
          }
        });
      }
    } else {
      error.message = "No matching key in the database";
    }

    return { data: null, errMessage: error };
  };

  readWholeFile = () => {
    let allData = [];
    try {
      const rawdata = fs.readFileSync(this.filePath);
      allData = JSON.parse(rawdata);
    } catch (err) {
      if (err.code == "ENOENT") {
        fs.appendFileSync(this.filePath, JSON.stringify([]));
      }
    }
    return allData;
  };

  readElement = (id) => {
    let returnObject = { errMessage: { message: "", systemMessage: "" } };
    const allData = this.readWholeFile();
    if (!allData) {
      error.message = "The file is empty";
      returnObject.errMessage = error;
    } else {
      const requiredData = allData.filter((data) => data.key === id);
      if (!requiredData.length) {
        returnObject.errMessage.message =
          "No element with the corresponding key exists in the database";
      } else if (requiredData[0].timeToLive <= Math.floor(Date.now() / 1000)) {
        returnObject.errMessage.message =
          "This key has expired and cannot be read";
      } else {
        returnObject.data = requiredData[0];
      }
    }

    return returnObject;
  };
}

module.exports.LocalStore = LocalStore;
