var scriptTag = document.createElement("script");
scriptTag.text = "var hackCfg={};";
$("head")[0].appendChild(scriptTag);
//console.log(hackCfg);
function eSwitch(title,parent,initialState,callback) {
  const switchE = $(`
  <div class="mdc-switch">
    <div class="hSwitch mdc-switch__track"></div>
    <div class="mdc-switch__thumb-underlay">
      <div class="mdc-switch__thumb">
          <input type="checkbox" id="${title}" class="mdc-switch__native-control" role="switch" ${initialState ? "checked" : ""}>
      </div>
    </div>
  </div>
  <label style='margin-left:5px;' for="${title}">${title}</label>
  `);
  parent.append($('<div class="hSwitch__wrapper"></div>').append(switchE));
  const switchControl = new mdc.switchControl.MDCSwitch(switchE[0]);
  switchControl.initialSyncWithDOM();
  switchE[0].addEventListener("change",function(e){
    switchE.filter(".hSwitch").toggleClass("checked",switchControl.checked);
    callback(switchControl.checked);
  });
  //console.log(switchControl);
  return [switchE,switchControl];
}

function updateCfg(key,val) {
  if (void 0 !== key && void 0 !== val) {
    hackCfg[key] = val;
  }
  chrome.storage.sync.set({"config":hackCfg},function() {console.log("updated config");});
  scriptTag.text = "var hackCfg="+JSON.stringify(hackCfg)+";";
  $(scriptTag).remove()
  $("head").append(scriptTag);
}
let hackCfg = {};
function loadPanel(){
chrome.storage.sync.get(['config'],function(data) {
  if ($.isEmptyObject(data)) {
    hackCfg =
      {"aimhacks":true,"adblocker":true,"locationDrawer":true,"settings":
        {"kd":true,"health":true,"name":false,"dead":false,"room":false,"maxHealth":false,"id":false,"likes":false,"deaths":false,"kills":false,"totalDamage":false,"totalHealing":false,"totalGoals":false,"score":false,"x":false,"xSpeed":false,"y":false,"ySpeed":false,"angle":false,"weapons":false,"currentWeapon":false,"bulletIndex":false,"spawnProtection":false,"team":false,"speed":false,"jumpCountdown":false,"jumpDelta":false,"jumpStrength":false,"gravityStrength":false,"frameCountdown":false,"type":false,"onScreen":false,"isn":false}
      }
    chrome.storage.sync.set({"config":hackCfg});
  }
  else {
    hackCfg = data["config"];
  }
  scriptTag.text = "var hackCfg="+JSON.stringify(hackCfg)+";";
  $(scriptTag).remove()
  $("head").append(scriptTag);
  // hackCfg = data["config"];
  // scriptTag = document.createElement("script");
  // scriptTag.text = "hackCfg="+JSON.stringify(hackCfg);
  // $("head")[0].appendChild(scriptTag);

  $("#linkBox,#namesBox").css("cssText","display:none !important;");
  if (hackCfg.adblocker) {
    $("#adWrapper").css("cssText","display:none !important;");
  }
  $("#startMenuWrapper").css({"flex-wrap":"wrap","justify-content":"space-between"});
  let hp = $('<div id="hackPanel"><p id="hackHeader">HACK PANEL</p></div>');
  let con = $('<div id="hackWrapper"></div>');
  hp.append(con);
  hp.insertBefore("#messageWrap");
  let aimHacks = eSwitch("Aimhacks",con,hackCfg.aimhacks,function(state){
    updateCfg("aimhacks",state)
  });
  let adBlocker = eSwitch("Adblocker",con,hackCfg.adblocker,function(state){
    updateCfg("adblocker",state);
    window.location.reload(false);
  });
  let locationDrawer = eSwitch("Location drawer",con,hackCfg.locationDrawer,function(state){
    if (!state) {
      for (var i=0;i<checkBoxes.length;i++) {
        checkBoxes[i][1].disable();
      }
    }
    else {
      for (var i=0;i<checkBoxes.length;i++) {
        checkBoxes[i][1].enable();
      }
    }
    updateCfg("locationDrawer",state);
  });
  let settingsMenu = $(`<div><div id='optionsWrapper'></div></div>`);
  settingsMenu.css({"height":"300px","margin":"0","margin-left":(locationDrawer[0].width())+"px"});
  let oW = settingsMenu.find("#optionsWrapper");
  //old "height":(settingsMenu.css("height").slice(0,-2)-hp.css("padding").slice(0,-2))+"px"
  let margin = 15;
  margin/=2;
  let lMargin = (settingsMenu.css("margin-left").slice(0,-2)/4)+"px";
  lMargin = 0;
  oW.css({"height":(settingsMenu.css("height").slice(0,-2)-margin)+"px","margin-top":margin+"px","overflow-y":"scroll","margin-left":lMargin});
  con.append(settingsMenu);
  let checkBoxes = []; //keep track of checkBox controls
  mdc.checkbox.MDCCheckbox.prototype.disable = function() {this.indeterminate=true;this.disabled=true;}
  mdc.checkbox.MDCCheckbox.prototype.enable = function() {this.indeterminate=false;this.disabled=false;}
  for (let option in hackCfg.settings) {
    let val = hackCfg.settings[option];
    let checkBox = $(`
    <div class="mdc-checkbox owCB">
    <input type="checkbox"
           class="mdc-checkbox__native-control"/>
    <div class="mdc-checkbox__background">
      <svg class="mdc-checkbox__checkmark"
           viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>`);
    oW.append($('<div class="checkBox__wrapper"></div>').append(checkBox).append($(`<p style='display:inline-block;'>${option}</p>`)).append($("<input style='margin-left:10px;border:none;border-bottom:1px solid black;outline:none;' type='text' placeholder='Hex value'></input>")));
    const checkBoxControl = new mdc.checkbox.MDCCheckbox(checkBox[0]);
    if (val) {
      checkBoxControl.checked = true;
    }
    checkBox[0].addEventListener("change",function(e){
      hackCfg.settings[option] = checkBoxControl.checked;
      console.log(hackCfg);
      updateCfg();
    });
    checkBoxes.push([checkBox,checkBoxControl]);
  }
  if (!hackCfg.locationDrawer) {
    for (var i=0;i<checkBoxes.length;i++) {
      checkBoxes[i][1].disable();
    }
  }


});
}
loadPanel();


//let aimHacks = $("<p style='display:inline-block;'>Aimbot</p><input type='radio'>");
//hp.append(aimHacks);
//hp.css({"width":"50px","height":"50px","background-color":"red"});
// function loadPanel() {
// $.ajax({
//   url:chrome.extension.getURL("hax.json"),
//   success:function(data) {
//     hackCfg = data;
//     $("#linkBox").remove();
//     $("#namesBox").remove();
//     $("#adWrapper").remove();
//     $("#startMenuWrapper").css({"display":"flex","flex-wrap":"wrap","justify-content":"space-between"});
//     let hp = $('<div id="hackPanel"><p id="hackHeader">HACK PANEL</p></div>');
//     let con = $('<div id="hackWrapper"></div>');
//     hp.append(con);
//     hp.insertBefore("#messageWrap");
//     let aimHacks = eSwitch("Aimhacks",con,function(state){
//       updateCfg("aimhacks",state)
//     });
//     let adBlocker = eSwitch("Adblocker",con,function(state){
//       updateCfg("adblocker",state);
//     });
//
//
//     //let aimHacks = $("<p style='display:inline-block;'>Aimbot</p><input type='radio'>");
//     //hp.append(aimHacks);
//     //hp.css({"width":"50px","height":"50px","background-color":"red"});
//   }
// });
// }
//
// loadPanel();
