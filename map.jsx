"object" != typeof JSON && (JSON = {}), function () { "use strict"; var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g, rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta, rep; function f(t) { return t < 10 ? "0" + t : t } function this_value() { return this.valueOf() } function quote(t) { return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) { var e = meta[t]; return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' } function str(t, e) { var r, n, o, u, f, a = gap, i = e[t]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (u = i.length, r = 0; r < u; r += 1)f[r] = str(r, i) || "null"; return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o } if (rep && "object" == typeof rep) for (u = rep.length, r = 0; r < u; r += 1)"string" == typeof rep[r] && (o = str(n = rep[r], i)) && f.push(quote(n) + (gap ? ": " : ":") + o); else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o); return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function (t, e, r) { var n; if (gap = "", indent = "", "number" == typeof r) for (n = 0; n < r; n += 1)indent += " "; else "string" == typeof r && (indent = r); if (rep = e, e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { var j; function walk(t, e) { var r, n, o = t[e]; if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? o[r] = n : delete o[r]); return reviver.call(t, e, o) } if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) { return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) }();

// bring document to the front
// var doc = app.documents.getByName("map");
// app.activeDocument = doc;
var doc = app.activeDocument;

// don't want smartquotes, they'll fuck the json
var originalSmartQuotes = app.preferences.smartQuotes;
app.preferences.smartQuotes = false;

// grab the JSON data from where it's stored in a text layer
var dataLayer = doc.layerSets.getByName("!!! DO NOT TOUCH !!!").artLayers.getByName("DATA");
var states = JSON.parse(dataLayer.textItem.contents);

// colours
var dem = new SolidColor;
dem.rgb.hexValue = "2268a5";
var gop = new SolidColor;
gop.rgb.hexValue = "ca2735";
var none = new SolidColor;
none.rgb.hexValue = "cccccc";

var stateLayers = doc.layerSets.getByName("MAP").layerSets.getByName("STATES");

//scrolling window with states and votes
var w = new Window("dialog", "Map updater");
var p = w.add("panel", undefined, "States");
p.size = [500, 500];

var g = p.add("group");
g.orientation = "column";
g.alignment = "left";
g.maximumSize.height = states.length * 100

// populate the states
for (var i = 0; i < states.length; i++) {
    var sub = g.add("panel", undefined, states[i].name + " - " + states[i].code + ". Total votes available: " + states[i].max);
    sub.size = [400, 50];
    sub.orientation = "row";
    sub.add("statictext", undefined, "Trump:");
    if (states[i].winner === "Trump") {
        sub.add("edittext", undefined, states[i].votes);
    } else {
        sub.add("edittext", undefined, 0);
    }
    sub.add("statictext", undefined, "          Biden:");
    if (states[i].winner === "Biden") {
        sub.add("edittext", undefined, states[i].votes);
    } else {
        sub.add("edittext", undefined, 0);
    }
    // g.add("statictext", undefined, "Item " + (i + 1));
}

var scrollBar = p.add("scrollbar");
scrollBar.stepdelta = 10;
scrollBar.maximumSize.height = p.maximumSize.height;


scrollBar.onChanging = function () {
    g.location.y = -1 * this.value;
}

w.onShow = function () {
    scrollBar.size = [20, p.size.height];
    scrollBar.location = [p.size.width - 20, 0];
    scrollBar.maxvalue = g.size.height - p.size.height + 30;
};

var buttons = w.add("group");
var update = buttons.add("button", undefined, "Update", { name: "OK" });
var close = buttons.add("button", undefined, "Close", { name: "Cancel" });
var reset = w.add("button", undefined, "Reset map");

update.onClick = parseResults;
reset.onClick = resetMap;

w.show();

function parseResults() {
    doc.suspendHistory("Updated map", "wrapper()");
    function wrapper() {
        var kids = g.children;
        var trumpTotal = 0;
        var bidenTotal = 0;
        for (var i = 0; i < states.length; i++) {
            var layerName = states[i].code + " - " + states[i].name;
            var trump = kids[i].children[1].text;
            var biden = kids[i].children[3].text;
            if (trump === "") {
                trump = "0";
                kids[i].children[1].text = "0";
            }
            if (biden === "") {
                biden = "0";
                kids[i].children[3].text = "0";
            }
            var numberMatch = new RegExp(/\b\d+\b/);
            // var numberMatch = "/\b\d+\b/;
            if (!(trump.match(numberMatch) && biden.match(numberMatch))) {
                alert("You've not entered a number correctly in " + states[i].name + "!\nFix the error then click Update to try again...");
                return false;
            }
            trump = parseInt(trump);
            biden = parseInt(biden);
            // increase the vote totals
            if (trump + biden > states[i].max) {
                var sanityCheck = confirm("You may have made an error in " + states[i].name + "! The max votes for this state is " + states[i].max + " but you've assigned " + (trump + biden) + " votes!\nContinue anyway?");
                if (!sanityCheck) {
                    return false;
                }
            }
            trumpTotal += trump;
            bidenTotal += biden;
            if (trump === 0 && biden === 0) { // no votes recorded, set to grey
                states[i].winner = null;
                var currentState = stateLayers.artLayers.getByName(layerName);
                selectLayerById(currentState.id);
                setColourOfShapeLayerFill(none);
                states[i].votes = 0;
            } else if (trump > biden) { // trump has won state, set to red, increase trumps vote total
                states[i].winner = "Trump";
                var currentState = stateLayers.artLayers.getByName(layerName);
                selectLayerById(currentState.id);
                setColourOfShapeLayerFill(gop);
                states[i].votes = trump;
            } else { // biden has won state, set to blue, increase bidens vote total
                states[i].winner = "Biden";
                var currentState = stateLayers.artLayers.getByName(layerName);
                selectLayerById(currentState.id);
                setColourOfShapeLayerFill(dem);
                states[i].votes = biden;
            }
        }

        // set trumps bar chart according to vote total
        var trumpBar = doc.layerSets.getByName("BARCHART").artLayers.getByName("TRUMP BAR");
        trumpBar.textItem.horizontalScale = trumpTotal * 2;
        doc.layerSets.getByName("BARCHART").artLayers.getByName("TRUMP number").textItem.contents = trumpTotal;

        // set bidens bar chart according to vote total
        var bidenBar = doc.layerSets.getByName("BARCHART").artLayers.getByName("BIDEN BAR");
        bidenBar.textItem.horizontalScale = bidenTotal * 2;
        doc.layerSets.getByName("BARCHART").artLayers.getByName("BIDEN number").textItem.contents = bidenTotal;

        // save the data to a text layer so it can be accessed later
        dataLayer.textItem.contents = JSON.stringify(states);

        // revert to original smart quotes setting (it's the nice thing to do)
        app.preferences.smartQuotes = originalSmartQuotes;

        w.close();
    }
}


function resetMap() {
    var confirmation = confirm("This will completely reset the map to zero (it's undoable via the history panel / ctrl-z)\nContinue?");
    if (confirmation) {
        doc.suspendHistory("Reset map", "wrapper()");
    }
    app.preferences.smartQuotes = originalSmartQuotes;
    w.close();

    function wrapper() {
        // reset all states to grey
        for (var i = 0; i < states.length; i++) {
            states[i].winner = null;
            states[i].votes = 0;
            var layerName = states[i].code + " - " + states[i].name;
            var currentState = stateLayers.artLayers.getByName(layerName);
            selectLayerById(currentState.id);
            setColourOfShapeLayerFill(none);
        }

        // reset trumps bar chart to 0
        var trumpBar = doc.layerSets.getByName("BARCHART").artLayers.getByName("TRUMP BAR");
        trumpBar.textItem.horizontalScale = 0;
        doc.layerSets.getByName("BARCHART").artLayers.getByName("TRUMP number").textItem.contents = 0;

        // reset bidens bar chart to 0
        var bidenBar = doc.layerSets.getByName("BARCHART").artLayers.getByName("BIDEN BAR");
        bidenBar.textItem.horizontalScale = 0;
        doc.layerSets.getByName("BARCHART").artLayers.getByName("BIDEN number").textItem.contents = 0;

        // save the data to the text layer
        dataLayer.textItem.contents = JSON.stringify(states);
    }
}




// -----------------------------------------------------------------------------------------------------------------------

function setColourOfShapeLayerFill(solidColor) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(stringIDToTypeID('contentLayer'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    desc.putReference(charIDToTypeID('null'), ref);
    var fillDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID('Rd  '), solidColor.rgb.red);
    colorDesc.putDouble(charIDToTypeID('Grn '), solidColor.rgb.green);
    colorDesc.putDouble(charIDToTypeID('Bl  '), solidColor.rgb.blue);
    fillDesc.putObject(charIDToTypeID('Clr '), charIDToTypeID('RGBC'), colorDesc);
    desc.putObject(charIDToTypeID('T   '), stringIDToTypeID('solidColorLayer'), fillDesc);
    executeAction(charIDToTypeID('setd'), desc, DialogModes.NO);
}

function selectLayerById(id, add) {
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID('Lyr '), id);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID("null"), ref);
    if (add) desc.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
    desc.putBoolean(charIDToTypeID("MkVs"), false);
    try {
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    } catch (e) { }
};