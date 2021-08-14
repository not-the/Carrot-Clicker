//// UI HANDLER ////
var bonusVisualArea = document.getElementById("bonusVisualArea");
// var tooltipBill = document.getElementById("billtooltip").style.top;
// var tooltipBelle = document.getElementById("belletooltip").style.top;
// var tooltipGreg = document.getElementById("gregtooltip").style.top;
var mouseX = 0;
var mouseY = 0;
var bonusID = 0;

// Click bonus popup
function popupHandler() {
    var clickVisualElement = document.createElement("div");
    var randomX = Math.floor((Math.random() * 10) - 5) + mouseX;
    var randomY = Math.floor((Math.random() * 10) - 5) + mouseY;

    clickVisualElement.style.left = randomX + "px";
    clickVisualElement.style.top = randomY + "px";
    clickVisualElement.classList.add("clickvisual");
    clickVisualElement.id = `bonus${bonusID}`;
    clickVisualElement.innerText = `+${DisplayRounded(Math.floor(player.cpc,2))}`;

    bonusVisualArea.append(clickVisualElement);
    var bonusCurrent = document.getElementById("bonus" + bonusID);
    setTimeout(() => {
        bonusCurrent.remove();
    }, 2000);

    // Incremement element ids
    if(bonusID < 100) {
        bonusID += 1;
    } else {
        bonusID = 0;
    }
}




// Mouse position handler
// https://stackoverflow.com/a/7790764
(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        
        mouseX = event.pageX;
        mouseY = event.pageY;


        // Character tooltips
        // var ctAdjust = event.pageY - 120;
        // if(ctAdjust < -4) {
        //     ctAdjust = -4
        // }
        // tooltipBill = `${ctAdjust}px`;
    }
})();
