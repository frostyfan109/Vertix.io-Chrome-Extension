$("head").append('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">');
var scriptTag = document.createElement("script");
scriptTag.id = "test";
scriptTag.text = "var hackCfg={};";
$("head")[0].appendChild(scriptTag);
//console.log(hackCfg);

function testSetHex(e,hex) {
  let oldCol = e.style.color;
  e.style.color = hex;
  return oldCol !== e.style.color;
}

function eSwitch(title,parent,initialState,callback) {
  const switchE = $(`
  <div class="mdc-switch">
    <div class="hSwitch mdc-switch__track"></div>
    <div class="mdc-switch__thumb-underlay">
      <div class="mdc-switch__thumb">
          <input type="checkbox" class="mdc-switch__native-control" role="switch" ${initialState ? "checked" : ""}>
      </div>
    </div>
  </div>
  <label style='margin-left:5px;'>${title}</label>
  `);
  let switchWrapper = $('<div class="hSwitch__wrapper"></div>');
  parent.append(switchWrapper.append(switchE));
  const switchControl = new mdc.switchControl.MDCSwitch(switchE[0]);
  switchControl.initialSyncWithDOM();
  switchE[0].addEventListener("change",function(e){
    switchE.filter(".hSwitch").toggleClass("checked",switchControl.checked);
    callback(switchControl.checked);
  });
  //console.log(switchControl);
  return [switchE,switchControl,switchWrapper];
}

function eToggle(parent,initialState,callback) {
  parent.parent().attr("et",true);
  const toggleE = $(`
  <i class="mdc-icon-toggle material-icons" role="button" aria-pressed="${initialState}"
    aria-label="" tabindex="0"
    data-toggle-on='{"content": "add_circle"}'
    data-toggle-off='{"content": "remove_circle"}'>
    remove_circle
  </i>`);
  parent.after(toggleE)
  mdc.iconToggle.MDCIconToggle.attachTo(toggleE[0]);
  toggleE.on("MDCIconToggle:change",({detail}) => {
    callback(toggleE,detail.isOn);
  });
  return toggleE;
}

function updateCfg(key,val) {
  if (void 0 !== key && void 0 !== val) {
    hackCfg[key] = val;
  }
  chrome.storage.sync.set({"config":hackCfg},function() {console.log("updated config");});
  scriptTag.text = "var hackCfg="+JSON.stringify(hackCfg)+";";
  $(scriptTag).remove();
  $("head").append(scriptTag);
}
let hackCfg = {};



function loadPanel(){
chrome.storage.sync.get(['config'],function(data) {
  if ($.isEmptyObject(data)) {
    hackCfg =
      {"aimhacks":true,"globalLocations":true,"noRecoil":false,"hideAimbot":true,"autoFire":true,"speedHacks":true,"collisionOutlines":true,"mouseAssistance":false,"spins":false,"spinsOld":0,"infiniteAmmo":1,"infiniteAmmoOld":1,"adblocker":true,"expand":{"locationDrawer":true,"ammo":true},"locationDrawer":true,"settings":
        {"KD":[true,"#000000"],"health":[true,"#000000"],"name":[false,"#000000"],"dead":[false,"#000000"],"room":[false,"#000000"],"maxHealth":[false,"#000000"],"id":[false,"#000000"],"likes":[false,"#000000"],"deaths":[false,"#000000"],"kills":[false,"#000000"],"totalDamage":[false,"#000000"],"totalHealing":[false,"#000000"],"totalGoals":[false,"#000000"],"score":[false,"#000000"],"x":[false,"#000000"],"xSpeed":[false,"#000000"],"y":[false,"#000000"],"ySpeed":[false,"#000000"],"angle":[false,"#000000"],"weapons":[false,"#000000"],"currentWeapon":[false,"#000000"],"bulletIndex":[false,"#000000"],"spawnProtection":[false,"#000000"],"team":[false,"#000000"],"speed":[false,"#000000"],"jumpCountdown":[false,"#000000"],"jumpDelta":[false,"#000000"],"jumpStrength":[false,"#000000"],"gravityStrength":[false,"#000000"],"frameCountdown":[false,"#000000"],"type":[false,"#000000"],"onScreen":[false,"#000000"],"isn":[false,"#000000"]}
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

  //$("#linkBox,#namesBox").css("cssText","display:none !important;");
  $("#linkBox,#namesBox").toggleClass("noDisp",true);
  if (hackCfg.adblocker) {
    //$("#adWrapper").css("cssText","display:none !important;");
    $("#adWrapper").toggleClass("noDisp",true);
  }
  $("#startMenuWrapper").css({"flex-wrap":"wrap","justify-content":"space-between"});
  let hp = $('<div id="hackPanel"><p id="hackHeader">HACK PANEL</p></div>');
  let con = $('<div id="hackWrapper"></div>');
  hp.append(con);
  hp.insertBefore("#messageWrap");
  let aimHacks = eSwitch("Aimbot",con,hackCfg.aimhacks,function(state){
    updateCfg("aimhacks",state)
  });
  let hideAimhacks = eSwitch("Hide Aimbot",con,hackCfg.hideAimbot,function(state){
    updateCfg("hideAimbot",state)
  });

  let mouseAssistance = eSwitch("Aimbot Mouse Assistance",con,hackCfg.mouseAssistance,function(state) {
    updateCfg("mouseAssistance",state);
  });

  let autoFire = eSwitch("Auto Fire",con,hackCfg.autoFire,function(state) {
    updateCfg("autoFire",state);
  });

  let globalLocations = eSwitch("Global Locations",con,hackCfg.globalLocations,function(state) {
    updateCfg("globalLocations",state);
  });
  globalLocations[2].append("<div class='info' style='margin-top:6px;'>Runs a second account that routinely rejoins the game to obtain locations</div>");

  let speedHacks = eSwitch("Speed Hacks",con,hackCfg.speedHacks,function(state) {
    updateCfg("speedHacks",state);
  });


  let locationDrawer = eSwitch("Location Drawer",con,hackCfg.locationDrawer,function(state){
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
  eToggle(locationDrawer[0].slice(-1),hackCfg.expand["locationDrawer"],function(toggle,state) {
    if (state) {
      toggle.removeClass("maximize minimize");
      toggle.addClass("minimize");
      $("#optionsWrapperContainer").slideUp(450);
    }
    else {
      toggle.removeClass("minimize maximize");
      toggle.addClass("maximize");
      $("#optionsWrapperContainer").slideDown(750);
    }
    hackCfg.expand["locationDrawer"] = state;
    updateCfg();
  });

  //locationDrawer[0].slice(-1).after(eToggle);
  let settingsMenu = $(`<div id='optionsWrapperContainer'><div id='optionsWrapper'></div></div>`);
  settingsMenu.css({"height":"270px","margin":"0","margin-left":(locationDrawer[0].width())+"px"});
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
    let inp = $("<input style='margin-left:10px;border:none;border-bottom:1px solid black;outline:none;' type='text' placeholder='Hex value'></input>");
    inp.val(val[1]);
    //inp.css("color",inp.val());
    let validCol = testSetHex(inp[0],inp.val());
    if (!validCol) {
      inp.css("color","#000000");
    }
    oW.append($('<div class="checkBox__wrapper"></div>').append(checkBox).append($(`<p style='margin:0;padding-top:11px;padding-bottom:11px;margin-left:-2.5px;display:inline-block;'>${option}</p>`)).append(inp));
    const checkBoxControl = new mdc.checkbox.MDCCheckbox(checkBox[0]);
    if (val[0]) {
      checkBoxControl.checked = true;
    }
    inp.on("change paste keyup", function() {
      let validCol = testSetHex(this,$(this).val());
      if (!validCol) {
        $(this).css("color","#000000");
      }
      hackCfg.settings[option] = [checkBoxControl.checked,$(this).val()];
      console.log(hackCfg);
      updateCfg();
    });
    checkBox[0].addEventListener("change",function(e){
      hackCfg.settings[option] = [checkBoxControl.checked,hackCfg.settings[option][1]];
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
  if (hackCfg.expand["locationDrawer"]) {
    $("#optionsWrapperContainer").slideUp(0);
  }


  let ammoSwitch = eSwitch("Infinite Ammo",con,!!hackCfg.infiniteAmmo,function(state){
    let radioState = 0;
    if (!state) {
      for (let radioElem of document.querySelectorAll(".reload")) {
        $(radioElem).addClass("mdc-radio--disabled");
        $(radioElem).find(".mdc-radio__native-control").attr("disabled","disabled")
      }
    }
    else {
      for (let radioElem of document.querySelectorAll(".reload")) {
        $(radioElem).removeClass("mdc-radio--disabled");
        $(radioElem).find(".mdc-radio__native-control").removeAttr("disabled");
        if ($(radioElem).find(".mdc-radio__native-control")[0].checked) {
          radioState = parseInt($(radioElem).find(".mdc-radio__native-control").attr("cfgVal"))
        }
      }
    }
    if (state === 0 && state !== radioState) {
      console.log(state,radioState);
    }
    updateCfg("infiniteAmmo",radioState);
  });
  let reload = $(`
  <div id="reloadWrapper">
  <div class="mdc-form-field">

  <div class='radioWrapper'>
  <label class='radio-label' for='1Radio'>Safe</label>
  <div class="mdc-radio reload">
    <input class="mdc-radio__native-control" cfgVal='1' id='1Radio' name='radio' type="radio">
    <div class="mdc-radio__background">
      <div class="mdc-radio__outer-circle"></div>
      <div class="mdc-radio__inner-circle"></div>
    </div>
  </div>
  </div>
  <div class="info">Undetectable by server but can be unreliable on poor connections</div>

  <div class='radioWrapper'>
  <label class='radio-label' for='2Radio'>Risky</label>
  <div class="mdc-radio reload">
    <input class="mdc-radio__native-control" cfgVal='2' id='2Radio' name='radio' type="radio">
    <div class="mdc-radio__background">
      <div class="mdc-radio__outer-circle"></div>
      <div class="mdc-radio__inner-circle"></div>
    </div>
  </div>
  </div>
  <div class="info">Prolonged use of certain weapons can result in being kicked (only recommended if on a slow connection)</div>

  </div></div>`);
  con.append(reload);
  $(`#${hackCfg.infiniteAmmo}Radio`).attr("checked","checked");
  //const formField = new mdc.formField.MDCFormField(document.querySelector('.mdc-form-field'));
  for (let radioElem of document.querySelectorAll(".reload")){
    //let radio = new mdc.radio.MDCRadio(radioElem);
    radioElem.addEventListener("change",function(e) {
      hackCfg.infiniteAmmoOld = parseInt($(radioElem).find(".mdc-radio__native-control").attr("cfgVal"));
      updateCfg("infiniteAmmo",parseInt($(radioElem).find(".mdc-radio__native-control").attr("cfgVal")));
      //console.log($(`label[for='${$(radioElem).find(".mdc-radio__native-control")[0].id}']`).text(),radio.checked);
    });
    //formField.input = radio;
  }


  eToggle(ammoSwitch[0].slice(-1),hackCfg.expand["ammo"],function(toggle,state) {
    if (state) {
      toggle.removeClass("maximize minimize");
      toggle.addClass("minimize");
      $("#reloadWrapper").next().animate({"margin-top":"15px"},450);
      $("#reloadWrapper").slideUp(450,function() {;
      });
    }
    else {
      toggle.removeClass("minimize maximize");
      toggle.addClass("maximize");
      $("#reloadWrapper").next().animate({"margin-top":"7.5px"},750);
      $("#reloadWrapper").slideDown(750,function() {
      });
    }
    hackCfg.expand["ammo"] = state;
    updateCfg();
  });

  let noRecoil = eSwitch("No recoil",con,hackCfg.noRecoil,function(state) {
    updateCfg("noRecoil",state);
  });
  noRecoil[2].append("<div class='info' style='margin-top:6px;'>Does not work with infinite ammo (only appears to)</div>");

  let collisionOutlines = eSwitch("Collision Outlines",con,hackCfg.collisionOutlines,function(state) {
    updateCfg("collisionOutlines",state);
  });

  let spins = eSwitch("Spins",con,hackCfg.spins,function(state) {
    updateCfg("spins",state ? hackCfg.spinsOld : false);
    if (state) {
      $("#spinInp").removeAttr("disabled");
    }
    else {
      $("#spinInp").attr("disabled","disabled");
    }
  });
  let spinInp = $(`
  <input id='spinInp' style='background-color:none;user-select:none;width:40%;transform:scale(.90);margin-left:10px;border:none;border-bottom:1px solid black;outline:none;'
  type='number' min='1' value='${hackCfg.spins ? hackCfg.spins : hackCfg.spinsOld}'></input>`);
  spinInp.on("input",function() {
    let val = parseInt($(this).val());
    if ($(this).val() !== "" && val != null) {
      $(this).removeClass("inv");
      updateCfg("spins",val);
      updateCfg("spinsOld",val);
    }
    else {
      $(this).removeClass("fade");
      //$(this).css("color","#ffffff");
      $(this).addClass("inv");
    }
  });
  spinInp.focusout(function() {
    if ($(this).val() === "") {
      $(this).addClass("fade");
      //$(this).css("color","#000000");
      $(this).removeClass("inv");
      $(this).val(hackCfg.spinsOld);
    }
  });
  spinInp[0].onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 36 && e.keyCode < 41)
      || e.keyCode == 8 || e.keyCode == 9)) {
        return false;
    }
  }
  spins[2].append(spinInp);
  if (!hackCfg.spins) {
    spinInp.attr("disabled","disabled");
  }

  let adBlocker = eSwitch("Adblocker",con,hackCfg.adblocker,function(state){
    updateCfg("adblocker",state);
    $("#adWrapper").toggleClass("noDisp",state);
  });

  if (hackCfg.expand["ammo"]) {
    $("#reloadWrapper").slideUp(0);
  }
  else {
    $("#reloadWrapper").next().css("margin-top","7.5px");
  }
  if (!hackCfg.infiniteAmmo) {
    for (let radioElem of document.querySelectorAll(".reload")) {
      $(radioElem).addClass("mdc-radio--disabled");
      $(radioElem).find(".mdc-radio__native-control").attr("disabled","disabled");
    }
  }
  for (let radioElem of document.querySelectorAll(".reload")) {
    if (hackCfg.infiniteAmmoOld === parseInt($(radioElem).find(".mdc-radio__native-control").attr("cfgVal"))) {
      $(radioElem).find(".mdc-radio__native-control").attr("checked","checked");
    }
  }

  $(".hSwitch__wrapper:has(.info)").next().css("margin-top","10px");


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
