/*
  RoundCoordinatesToValue.jsx for Adobe Illustrator

  Description: Rounds the coordinates of anchors and/or handles to a specified level of precision.

  Author: organizedslop

  Release notes:
  0.1 Initial version
*/

// Creates dialog window
var dialog = new Window("dialog");
  dialog.text = "Round Values";
  dialog.preferredSize.width = 200;
  dialog.orientation = "column";
  dialog.alignChildren = ["center", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;

// Creates selection panel
var panelS = dialog.add("panel", undefined, undefined, {name: "panelS"});
  panelS.text = "Apply to";
  panelS.preferredSize.width = 110;
  panelS.orientation = "column";
  panelS.alignChildren = ["left", "center"];
  panelS.spacing = 10;
  panelS.margins = 10;

var radiobuttonAll = panelS.add("radiobutton", undefined, undefined, {name: "radiobuttonAll"});
  radiobuttonAll.text = "All";
  radiobuttonAll.value = true;

var radiobuttonSel = panelS.add("radiobutton", undefined, undefined, {name: "radiobuttonSel"});
  radiobuttonSel.text = "Selected";

var divider = panelS.add("panel", undefined, undefined, {name: "divider"});
  divider.alignment = "fill";

var checkboxAnchors = panelS.add("checkbox", undefined, undefined, {name: "checkboxAnchors"});
  checkboxAnchors.text = "Anchors";
  checkboxAnchors.value = true;

var checkboxHandles = panelS.add("checkbox", undefined, undefined, {name: "checkboxHandles"});
  checkboxHandles.text = "Handles";

// Creates precision panel
var panelP = dialog.add("panel", undefined, undefined, {name: "panelP"});
  panelP.text = "Precision (" + getUnits() + ")";
  panelP.preferredSize.width = 110;
  panelP.orientation = "column";
  panelP.alignChildren = ["center", "center"];
  panelP.spacing = 10;
  panelP.margins = 10;

var precisionInput = panelP.add('edittext {justify: "center", properties: {name: "precisionInput"}}');
  precisionInput.text = "1";
  precisionInput.preferredSize.width = 50;

// Creates OK and Cancel buttons
var groupConfirm = dialog.add("group"),
    buttonOk = groupConfirm.add("button", undefined, "OK"),
    buttonCancel = groupConfirm.add("button", undefined, "Cancel");

buttonOk.onClick = function(){
  main();
  dialog.close();
};

// Returns abbreviated document units
function getUnits(){
  var units = app.activeDocument.XMPString.match(/<stDim:unit>.*<\/stDim:unit>/).toString().slice(12, -13);
  var unitAbbreviations = {"Pixels":"px", "Points":"pt", "Picas":"pc", "Inches":"in",
                           "Feet":"ft", "Yards":"yd", "Millimeters":"mm", "Centimeters":"cm",
                           "Meters":"m"};
  return unitAbbreviations[units];
}

dialog.show();

// =============================================================================

function main() {
  if (!documents.length)
    return;

  var doc = app.activeDocument,
      roundTo = precisionInput.text,
      selPaths = [],
      selPoints = [];

  getPaths(doc.pageItems, selPaths);
  getPoints(selPaths, selPoints);

  for (var i = 0; i < selPoints.length; i++) {
    if (checkboxAnchors.value) {
      selPoints[i].anchor = round(selPoints[i].anchor, roundTo);
    }
    if (checkboxHandles.value) {
      selPoints[i].leftDirection = round(selPoints[i].leftDirection, roundTo);
      selPoints[i].rightDirection = round(selPoints[i].rightDirection, roundTo);
    }
  }
}

// Rounds coordinates to the given precision
function round(point, roundTo) {
  return [Math.round(point[0] / roundTo) * roundTo,
          Math.round(point[1] / roundTo) * roundTo];
}

// Gets paths from selection
function getPaths(items, arr) {
  for (var i = 0; i < items.length; i++) {
    var currItem = items[i];
    try {
      if (currItem.typename == "GroupItem") {
        getPaths(currItem.pageItems, arr);
      }
      else if (currItem.typename == "PathItem") {
        arr.push(currItem);
      }
      else if (currItem.typename == "CompoundPathItem") {
        getPaths(currItem.pathItems, arr);
      }
      else {
        currItem.selected = false;
      }
    } catch (error){}
  }
  return arr;
}

// Gets selected points on paths
function getPoints(items, arr) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].pathPoints.length > 1) {
      var points = items[i].pathPoints;
      for (var j = 0; j < points.length; j++) {
        if (radiobuttonSel.value == true) {
          if (isSelected(points[j])) arr.push(points[j]);
        } else arr.push(points[j]);
      }
    }
  }
}

// Check if current point is selected
function isSelected(point) {
  return point.selected == PathPointSelection.ANCHORPOINT;
}

// =============================================================================

try {
  main();
} catch(error) {}
