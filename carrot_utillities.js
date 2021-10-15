/* Created by JJCVIP and Not-The */
/* Utility functions*/


 // getElementById shorthandx
function dom(id) {return document.getElementById(id);}

// Local Storage shorthand (Strings only)
function store(key, data) {
    if(data) {
        localStorage.setItem(key, data);
    } else {
        return localStorage.getItem(key);
    }
}


// Locally Store Objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

//Creates Bases to Display Large Numbers 
const Bases=[];
for(i=1000;i<99999999999999999999999999999;i=i*1000) {
    Bases.push(i);
}

// Displaying Roundced Numbers example"100m 140b
function DisplayRounded(Value, Fixedto=3) {
    var units = ["k","m","b","t","q","Q","s","S"];
    for(i=0;i<units.length;i++){
        if(Value<Bases[i+1] && Value>Bases[0]){
            return (Value/Bases[i]).toFixed(Fixedto)+units[i];
        }
    }
    return Value;
}

//multibuy
const multibuy = [1,10,100];
var multibuySelector = 0;
function multibuySpin(){
  if(multibuy[multibuy.length-1]>multibuy[multibuySelector]){
    multibuySelector++;
  }else{
    multibuySelector=0;
  }
}


// delete save
function ClearLocalStorage(){
    console.log('Clearing local storage');
    
    localStorage.clear();
    location.reload();
}

// Capitalize first letter of string
// https://stackoverflow.com/a/1026087
function capitalizeFL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



// Popup Notifications
function openDialog(title, desc, buttonName, buttonStyle, buttonAction) {
    dialogOpen = true;
    overlay.classList.add("visible");
    // elDialog.main.classList.add("dialog_animate");

    // Fill out dialog text, if applicable
    if(title)       {elDialog.title.innerText = title;}
    if(desc)        {elDialog.desc.innerText = desc;}
    if(buttonName)  {elDialog.buttons.accept.innerText = buttonName;}
    if(buttonStyle) {
        elDialog.buttons.accept.classList.add(buttonStyle);
    }

    dialogButtonAction = buttonAction;
}

// Close dialog
function closeDialog(doAction) {
    dialogOpen = false;
    elDialog.title.innerText = 'Dialog Title';
    elDialog.desc.innerText = 'Dialog description';
    // Reset Accept button
    elDialog.buttons.accept.classList.remove(...elDialog.buttons.accept.classList);
    // elDialog.buttons.accept.onclick = closeDialog;
    elDialog.buttons.accept.innerText = "OK";

    overlay.classList.remove("visible");
    // elDialog.main.classList.remove("dialog_animate");

    // Run passed in function if applicable
    // if(action) {
    //     action();
    // }

    // Run a function when accept is pressed
    if(doAction) {
        switch(dialogButtonAction) {
            case 'prestige':
                Prestige();
                break;
            case 'clearsave':
                ClearLocalStorage();
                break;
        };
    };

    dialogButtonAction = 'none';
}

// Create Toast notification
// For the COLOR parameter, options are:
// gray (leave blank), "red", "orange", "gold", "green", "cyan", "blue", "purple", "brown", "dirt" 
function toast(title, desc, color, persistent) {
    // Create element with parameters filled in
    var toastElement = document.createElement("div");
    toastElement.innerHTML =
    `<div class="toast background_${color}" id="toast${toastID}">
        <h3>${title}</h3>
        <span class="toast_close" onclick="closeToast(${toastID})">X</span>
        <p>${desc}</p>
    </div>`;
    toastContainer.prepend(toastElement);

    let id = toastID;
    toastsList[toastID] = id;

    // Increase Toast ID
    activeToasts++;
    if(toastID <= 100) {
        toastID++;
    } else {
        toastID = 0;
    }



    // Clear all button
    if(activeToasts > 2) {
        toastsClear.classList.add("visible");
    }

    if(!persistent) {
        setTimeout(() => {
            // console.log("Timeout runs: " + toastID);
            closeToast(id);
        }, store("notificationLength") == null ? 5000 : parseInt(store("notificationLength")) * 1000
        );
    }
}

// Delete Toast Notification
function closeToast(id) {
    // console.log(id + " - toast removed");
    activeToasts--;
    delete toastsList[id];
    element = dom(`toast${id}`);
    
    // Dismiss Animation
    if(element !== null) {element.classList.add("toast_out");}
    
    // Delete Element after animation is done
    setTimeout(() => {
        if(element !== null) {element.remove();}
    }, 300);

    // Clear all button
    if(activeToasts <= 2) {
        toastsClear.classList.remove("visible");
    }
}

function clearToasts() {
    for(entry in toastsList) {
        console.log(entry);
        closeToast(entry);
    }
}