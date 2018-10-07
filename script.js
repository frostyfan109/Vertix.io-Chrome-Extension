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
  hackCfg[key] = val;
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
        {"kd":true,"account":false,"name":false,"health":true,"dead":false,"room":false,"maxHealth":false,"id":false,"likes":false,"deaths":false,"kills":false,"totalDamage":false,"totalHealing":false,"totalGoals":false,"score":false,"x":false,"xSpeed":false,"y":false,"ySpeed":false,"angle":false,"weapons":false,"currentWeapon":false,"bulletIndex":false,"spawnProtection":false,"team":false,"speed":false,"jumpCountdown":false,"jumpDelta":false,"jumpStrength":false,"gravityStrength":false,"frameCountdown":false,"type":false,"onScreen":false,"isn":false}
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
    updateCfg("locationDrawer",state);
  });
  let settingsMenu = $(`<div><u style='margin:0'>Player information</u><div id='optionsWrapper'></div></div>`);
  settingsMenu.css({"margin":"0","margin-left":locationDrawer[0].width()+9+"px"});
  let oW = settingsMenu.find("#optionsWrapper");
  oW.css({"overflow-y":"scroll","margin-left":(settingsMenu.css("margin-left").slice(0,-2)/2)+"px"});
  for (let option in hackCfg.settings) {
    let val = hackCfg.settings[option];
    oW.append($(`<p> ${option} = ${val}</p>`));
  }
  con.append(settingsMenu);


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
