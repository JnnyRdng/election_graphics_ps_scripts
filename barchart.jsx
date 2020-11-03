var doc = app.documents.getByName("light_barchart.psd");
app.activeDocument = doc;


// get the layers
var trumpNum = doc.artLayers.getByName("TRUMP NUMBER").textItem;
var bidenNum = doc.artLayers.getByName("BIDEN NUMBER").textItem;
var trumpBar = doc.artLayers.getByName("TRUMP BAR").textItem;
var bidenBar = doc.artLayers.getByName("BIDEN BAR").textItem;


// set up scriptui window
var win = new Window("dialog");
var bidenG = win.add("group");
var biden = bidenG.add("statictext");
biden.text = "Biden: ";
var bidenVotes = bidenG.add("edittext", [0, 0, 100, 30], bidenNum.contents);
bidenVotes.active = true;

var trumpG = win.add("group");
var trump = trumpG.add("statictext");
trump.text = "Trump: ";
var trumpVotes = trumpG.add("edittext", [0, 0, 100, 30], trumpNum.contents);
var update = win.add("button", undefined, "Update", { name: "OK" });

update.onClick = updateGraphic;

win.show();

// update
function updateGraphic() {
    doc.suspendHistory("Update figures", "wrapper()");
    win.close();
    function wrapper() {
        var newTrumpNum = parseInt(trumpVotes.text);
        var newBidenNum = parseInt(bidenVotes.text);

        if (newTrumpNum !== trumpNum) {
            trumpNum.contents = newTrumpNum;
            trumpBar.horizontalScale = newTrumpNum * 2;
        }
        if (newBidenNum !== bidenNum) {
            bidenNum.contents = newBidenNum;
            bidenBar.horizontalScale = newBidenNum * 2;
        }
    }
}
