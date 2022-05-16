/*







*/

var dialog = new Window("dialog");
  dialog.text = "Round Values";
  dialog.preferredSize.width = 200;
  dialog.orientation = "column";
  dialog.alignChildren = ["center", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;

// Create selection panel
var panel1 = dialog.add("panel", undefined, undefined, {name: "panel1"});
  panel1.text = "Apply to";
  panel1.preferredSize.width = 110;
  panel1.orientation = "column";
  panel1.alignChildren = ["left", "center"];
  panel1.spacing = 10;
  panel1.margins = 10;

var radiobuttonAll = panel1.add("radiobutton", undefined, undefined, {name: "radiobuttonAll"});
  radiobuttonAll.text = "All";
  radiobuttonAll.value = true;

var radiobuttonSel = panel1.add("radiobutton", undefined, undefined, {name: "radiobuttonSel"});
  radiobuttonSel.text = "Selected";

var divider = panel1.add("panel", undefined, undefined, {name: "divider"});
  divider.alignment = "fill";

var checkboxAnchors = panel1.add("checkbox", undefined, undefined, {name: "checkboxAnchors"});
  checkboxAnchors.text = "Anchors";
  checkboxAnchors.value = true;

var checkboxHandles = panel1.add("checkbox", undefined, undefined, {name: "checkboxHandles"});
  checkboxHandles.text = "Handles";

// Create Round to panel
var panel2 = dialog.add("panel", undefined, undefined, {name: "panel2"});
  panel2.text = "Round to (" + getUnits() + ")";
  panel2.preferredSize.width = 110;
  panel2.orientation = "column";
  panel2.alignChildren = ["center", "center"];
  panel2.spacing = 10;
  panel2.margins = 10;

var edittextroundTo = panel2.add('edittext {justify: "center", properties: {name: "edittextroundTo"}}');
  edittextroundTo.text = "1";
  edittextroundTo.preferredSize.width = 50;

// Create OK and Cancel buttons
var groupConfirm = dialog.add("group"),
    buttonOk = groupConfirm.add("button", undefined, "OK"),
    buttonCancel = groupConfirm.add("button", undefined, "Cancel");

buttonOk.onClick = function(){
  main();
  dialog.close();
};


dialog.show();

// =============================================================================

function main() {
  var doc = app.activeDocument,
      roundTo = edittextroundTo.text,
      selPaths = [],
      selPoints = [];

  getPaths(doc.pageItems, selPaths);
  getPoints(selPaths, selPoints);

  for (var i = 0, pLen = selPoints.length; i < pLen; i++) {
    if (checkboxAnchors.value) {
      selPoints[i].anchor = round(selPoints[i].anchor, roundTo);
    }
    if (checkboxHandles.value) {
      selPoints[i].leftDirection = round(selPoints[i].leftDirection, roundTo);
      selPoints[i].rightDirection = round(selPoints[i].rightDirection, roundTo);
    }
  }
}

function round(point, roundTo) {
  return [Math.round(point[0] / roundTo) * roundTo,
          Math.round(point[1] / roundTo) * roundTo];
}

// Get paths from selection
function getPaths(items, arr) {
  for (var i = 0, iLen = items.length; i < iLen; i++) {
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
    } catch (e){}
  }
  return arr;
}

// Get selected points on paths
function getPoints(items, arr) {
  for (var i = 0, iLen = items.length; i < iLen; i++) {
    if (items[i].pathPoints.length > 1) {
      var points = items[i].pathPoints;
      for (var j = 0, pLen = points.length; j < pLen; j++) {
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

function getUnits(){
  var units = app.activeDocument.rulerUnits.toString().substring(11);
  if (units == "Pixels") return "px";
  else if (units == "Points") return "pt";
  else if (units == "Picas") return "pc";
  else if (units == "Inches") return "in";
  else if (units == "Feet") return "ft";
  else if (units == "Yards") return "yd";
  else if (units == "Millimeters") return "mm";
  else if (units == "Centimeters") return "cm";
  else if (units == "Meters") return "m";
  else return units;
}

// =============================================================================

try {
  main();
} catch(e) {}
