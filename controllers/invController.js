const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};


invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildItemByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getItemByInvId(inv_id);
  const grid = await utilities.buildItemGrid(data);
  let nav = await utilities.getNav();
  const carTitle = data.inv_year + " " + data.inv_make + " " + data.inv_model;
  res.render("./inventory/detail", {
    title: carTitle,
    nav,
    grid,
  });
};


invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const pageTitle = "Vehicle Management";
  res.render("./inventory", {
    title: pageTitle,
    nav,
    errors: null,
    classificationSelect,
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classificationList,
  });
};


invCont.addClassificationName = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const classificationSelect = await utilities.buildClassificationList();

  const classResult = await invModel.registerClassification(classification_name);

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, ${classification_name} was added as Classification Name.`
    );
    res.status(201).render("./inventory", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      classificationSelect,
    });
  }
};


invCont.addNewVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const new_price = Number(inv_price);
  const new_miles = Number(inv_miles);

  const classResult = await invModel.registerVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    new_price,
    inv_year,
    new_miles,
    inv_color
  );

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, ${inv_make} was added as Classification Name.`
    );
    res.status(201).render("./inventory", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      classificationSelect,
    });
  }
};


invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getItemByInvId(inventory_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    classificationSelect: classificationSelect,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.deleteView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getItemByInvId(inventory_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

invCont.deleteItem = async function (req, res, next) {
  const { inv_id } = req.body;
  const deleteResult = await invModel.deleteInventoryItem(inv_id);
  if (deleteResult) {
    req.flash("notice", "The deletion was successful.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv/");
  }
};

module.exports = invCont;