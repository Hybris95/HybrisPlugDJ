/** GNU GPLv3 Licensing :
Christian BUISSON French Developper contact by electronic mail: hybris_95@hotmail.com
Copyright © 2014 Christian BUISSON

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software Foundation,
    Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
*/

/** USAGE :
Firefox:
Add the following line as a bookmark :
javascript:(function(){$.getScript('https://raw.githubusercontent.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.js');}());
Chrome:
Add the following line as a bookmark :
javascript:(function(){$.getScript('https://rawgit.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.js');}());
 ** Usage Method :
 ** copy/paste the entire script into the Firefox/Chrome Console (Ctrl+Shift+C Shortcut)
 ** For Firefox users (if you want notice sound) :
 ** about:config -> security.mixed_content.block_active_content = false
*/

/**
 * Global Vars
 */
var debug = false;
var ownUserName = API.getUser().username;
var lastTimeStamp;
var loadedSound;
if(!loadedSound){
    loadedSound = new Audio(decodeURIComponent("https://gmflowplayer.googlecode.com/files/notify.ogg"));
}
var oldWaitList = API.getWaitList();

/**
 * Just a chill room features
 */
function isInChill(){
	return window.location.pathname == "/new-to-this-shit-mrsuicidesheep";
}
/**
 * Electro, Dubstep & Techno features
 */
function isInEDT(){
    return window.location.pathname == "/edtentertainment";
}
/**
 * Tastycat features
 */
function isInTasty(){
    return window.location.pathname == "/tastycat";
}
/**
 * AnimeMusic.me and Japanese Music
 */
function isInHummingBird(){
    return window.location.pathname == "/hummingbird-me";
}
/**
 * Trance House Chill
 */
function isInTranceHouseChill(){
    return window.location.pathname == "/trancehousechill";
}
/**
 * SETTINGS
 */
var autoNotice = {
    disabled: false,
    onMention: 1,
    onChat: 2
};
var autoJoinLeaveNotice = {
    disabled: false,
    all: 1,
    moderators: 2
};
var settings = {
    changedAutoW: false,
    autoW: false,

    changedAutoJ: false,
    autoJ: false,

    changedAutoNotice: false,
    autoNotice: autoNotice.disabled,

    changedAutoJoinLeaveNotice: false,
    autoJoinLeaveNotice: autoJoinLeaveNotice.disabled,

    changedAutoHUI: false,
    autoHUI: false,
    
    changedAutoWL: false,
    autoWL: false,
    
    showToolbar: true
};
function loadSettings(){
    var localSettings = JSON.parse(localStorage.getItem('hybrisPlugDJSettings'));
    if(localSettings){
        for(var setting in settings){
            if(typeof localSettings[setting] != 'undefined'){
                settings[setting] = localSettings[setting];
            }
        }
    }
}
function saveSettings(){
    localStorage.setItem('hybrisPlugDJSettings', JSON.stringify(settings));
}
/**
 * STATS
 */
var getMeanDuration;// TODO - Include this in the Advance event and implement our own history
if(!getMeanDuration){
    getMeanDuration = function(){
		var meanDuration = 0;
		var minDuration;
		var maxDuration = 0;
		var history = API.getHistory();
		for(var i = 0; i < history.length; i++){
			var currentDuration = history[i].media.duration;
			meanDuration = meanDuration + currentDuration;
			if(i == 0){
			    minDuration = currentDuration;
			}
			if(currentDuration < minDuration){
			    minDuration = currentDuration;
			}
			if(currentDuration > maxDuration){
			    maxDuration = currentDuration;
			}
		}
        if(history.length > 2){
            meanDuration = (meanDuration - minDuration) - maxDuration;
            meanDuration = meanDuration / (history.length - 2);
        }
        else if(history.length != 0){
            meanDuration = meanDuration / history.length
        }
		return meanDuration;
    };
}

var getEta;
if(!getEta){
    getEta = function(){
        var currentPosition = API.getWaitListPosition();
        if(currentPosition == -1){
            currentPosition = API.getWaitList().length;
        }
        var currentSongTimeLeft = API.getTimeRemaining();
        var meanDuration = getMeanDuration();
        
        var etaInSec = Math.floor((currentPosition * meanDuration) + currentSongTimeLeft);
        var nbOfHours = Math.floor((etaInSec / 60) / 60);
        var nbOfMinutes = Math.floor((etaInSec - (nbOfHours * 60 * 60)) / 60);
        var nbOfSec = etaInSec - (nbOfHours * 60 * 60) - (nbOfMinutes * 60);
        if(nbOfMinutes < 10){
            nbOfMinutes = "0" + nbOfMinutes;
        }
        if(nbOfSec < 10){
            nbOfSec = "0" + nbOfSec;
        }
        if(debug){console.log("Mean duration: " + meanDuration);}
        API.chatLog(":information_source: Estimated Time Awaiting : " + nbOfHours + ":" + nbOfMinutes + ":" + nbOfSec, true);
    };
}

function askCurrentMehs(){
    var media = API.getMedia();
    var author = media.author;
    var title = media.title;
    var audience = API.getAudience();
    var atLeastOneMeh = false;
    API.chatLog(":thumbsdown: " + author + " - " + title, true);
    for(var i = 0; i < audience.length; i++){
        var user = audience[i];
        if(user.vote == -1){
            API.chatLog(user.username + " mehed");
            atLeastOneMeh = true;
        }
    }
    if(!atLeastOneMeh){
        API.chatLog("Nobody mehed");
    }
}
function askCurrentGrabs(){
    var media = API.getMedia();
    var author = media.author;
    var title = media.title;
    var audience = API.getAudience();
    var atLeastOneGrab = false;
    API.chatLog(":thumbsup: " + author + " - " + title, true);
    for(var i = 0; i < audience.length; i++){
        var user = audience[i];
        if(user.grab){
            API.chatLog(user.username + " grabbed");
            atLeastOneGrab = true;
        }
    }
    if(!atLeastOneGrab){
        API.chatLog("Nobody grabbed");
    }
}

function aboutHybris(){
    API.chatLog(":information_source: [Features]", true);
    API.chatLog("AutoWoot - Green: activated, Red: deactivated");
    API.chatLog("AutoJoin - Green: activated, Red: deactivated");
    API.chatLog("Chat sound - Green: mention, Blue: all, Red: none");
    API.chatLog("Join/Leave notice - Green: all, Blue: moderators, Red: none");
    API.chatLog("Hide user interface - Green: activated, Red: deactivated");
    API.chatLog("Follow WaitList - Green: activated, Red: deactivated");
    API.chatLog("ETA? - Get the Estimated Time Awaiting from the current position");
    API.chatLog("Mehs? - Get the list of people who mehed the current media");
    API.chatLog("Grabs? - Get the list of people who grabbed the current media");
}

/**
 * CHANGE ROOM EVENT :
 */
var changeRoomEventHookedOnApi;
var changeRoomFunction;// TODO - Effectively hook this on a room change event (dispatchevent ???)
if(!changeRoomFunction){
    changeRoomFunction = function() {
        oldWaitList = API.getWaitList();
        if(settings.autoW){
            woot();
        }
        if(settings.autoJ){
            join();
        }
    };
}

/**
 * ADVANCE EVENT :
 * AutoWoot and AutoHideUI
 */
var advanceEventHookedOnApi;
var advanceFunction;
if(!advanceFunction){
    advanceFunction = function(data) {
        if(debug){console.log("Advance event");console.log(data);}
        
        // TODO - Say here your stats if you were the last one playing
        
        if(settings.autoHUI){
            hideUI();
        }else{
            showUI();
        }
        
        if(settings.autoW){
            woot();
        }
        
        if(settings.autoJ){
            join();
        }
    };
}

function woot() {
    $("#woot").click();
}

function canAutoJoin(){
    var canJoin = true;
    if(canJoin && isInChill()){
        canJoin = false;
    }
    if(canJoin && isInHummingBird()){
        canJoin = false;
    }
    if(canJoin && isInTranceHouseChill()){
        canJoin = false;
    }
    return canJoin;
}
function join() {
    if(debug){console.log("Try to autojoin");}
    if(canAutoJoin()){
        if(debug){console.log("Autojoins for real");}
        API.djJoin();
    }
}

function hideUI(){
    $('#playback-container').addClass('hide-video');
    $('#playback').addClass('hide-video');
    $("#audience-canvas").addClass('hide-video');
    $("#dj-canvas").addClass('hide-video');
    $('.background').hide();
    $('.room-background').hide();
}
function showUI(){
    $('#playback-container').removeClass('hide-video');
    $('#playback').removeClass('hide-video');
    $("#audience-canvas").removeClass('hide-video');
    $("#dj-canvas").removeClass('hide-video');
    $('.background').show();
    $('.room-background').show();
}

/**
 * JOIN EVENT :
 * AutoJoinNotice
 */
var autoJoinLeaveHookedOnApi;
var someoneJoined;
if(!someoneJoined){
    someoneJoined = function(user){
        if(debug){console.log("Join event");console.log(user);}
    	if((settings.autoJoinLeaveNotice == autoJoinLeaveNotice.all) || (settings.autoJoinLeaveNotice == autoJoinLeaveNotice.moderators && user.role > 0)) {
            API.chatLog(":on: " + user.username + " joined the room", true);
    	}
    };
}
/**
 * LEAVE EVENT :
 * AutoLeaveNotice
 */
var someoneLeft;
if(!someoneLeft){
    someoneLeft = function(user){
        if(debug){console.log("Leave event");console.log(user);}
    	if((settings.autoJoinLeaveNotice == autoJoinLeaveNotice.all) || (settings.autoJoinLeaveNotice == autoJoinLeaveNotice.moderators && user.role > 0)) {
            API.chatLog(":end: " + user.username + " left the room", false);
    	}
    };
}

/**
 * WAIT LIST UPDATE EVENT :
 * AutoWaitList
 */
var waitListUpdateHookedOnApi;
var waitListUpdate;
if(!waitListUpdate){
    waitListUpdate = function(newWaitList){
        if(debug){console.log("WaitListUpdate event");console.log(newWaitList);}
        
        // Recovers the addition in the new waitlist
        if(settings.autoWL){
            var currentDJ = API.getDJ();
            if(debug){console.log("Current DJ");console.log(currentDJ);}
            var currentHistory = API.getHistory();
            var lastDJ = currentDJ;
            if(currentHistory.length > 0){
                var lastHistory = currentHistory[0];
                lastDJ = lastHistory.user;
                if(lastDJ.id == currentDJ.id && currentHistory.length > 1){
                    lastHistory = currentHistory[1];
                    lastDJ = lastHistory.user;
                }
            }
            if(debug){console.log("Last DJ");console.log(lastDJ);}
            var waitListAdd = new Array();
            for(var i = 0; i < newWaitList.length; i++){
                var userWaiting = newWaitList[i];
                var isNew = true;
                for(var j = 0; j < oldWaitList.length; j++){
                    var userWasWaiting = oldWaitList[j];
                    if(userWaiting.id == userWasWaiting.id){
                        isNew = false;
                    }
                }
                if(isNew){
                    waitListAdd.push(userWaiting);
                    if(lastDJ.id == userWaiting.id){
                        API.chatLog(":up: " + userWaiting.username + " rejoined the waitlist");
                    }else{
                        API.chatLog(":new: " + userWaiting.username + " joined the waitlist");
                    }
                }
            }
            // Recovers the deletion in the new waitlist
            var waitListDel = new Array();
            for(var i = 0; i < oldWaitList.length; i++){
                var userWasWaiting = oldWaitList[i];
                var hasLeft = true;
                for(var j = 0; j < newWaitList.length; j++){
                    var userWaiting = newWaitList[j];
                    if(userWaiting.id == userWasWaiting.id){
                        hasLeft = false;
                    }
                }
                if(hasLeft){
                    waitListDel.push(userWasWaiting);
                    if(currentDJ.id != userWasWaiting.id){
                        API.chatLog(":free: " + userWasWaiting.username + " left the waitlist");
                    }else{
                        API.chatLog(":cool: " + userWasWaiting.username + " left the waitlist to become a DJ");
                    }
                }
            }
            if(debug){console.log(waitListAdd);console.log(waitListDel);}
        }
        oldWaitList = newWaitList;
        
        if(settings.autoJ){
            join();
        }
    };
}
/**
 * CHAT EVENT :
 * AutoNotice Only -> http://pastebin.com/Hsi2YMDH
 */
var chatEventHookedOnApi;
var analyseChat;
if(!analyseChat){
    analyseChat = function(chat){
        if(debug){console.log("Chat event");console.log(chat);}
        var message = chat.message;
        var username = chat.un;
        var type = chat.type;
        var uid = chat.uid;
        var cid = chat.cid;
        var timestamp = chat.timestamp;
        
        // Recover the latest timestamp for the user
        if(username == ownUserName){
            lastTimeStamp = timestamp;
        }
        
        // Watch chat sent by other users
        if(username != ownUserName){
            if(type == "message"){
                // AutoNotice (on every chat message)
                if(settings.autoNotice == autoNotice.onChat){
                    loadedSound.play();
                }
            }
            else if(type == "mention"){
                // AutoNotice (on mention message)
                if(settings.autoNotice == autoNotice.onMention || settings.autoNotice == autoNotice.onChat){
                    loadedSound.play();
                }
            }
        }
    };
}
/**
 * Event Management
 */
function refreshAPIStatus()
{
    if(!advanceEventHookedOnApi){
        API.on(API.ADVANCE, advanceFunction);
        advanceEventHookedOnApi = true;
    }
    
    if(!chatEventHookedOnApi){
        API.on(API.CHAT, analyseChat);
        chatEventHookedOnApi = true;
    }
    
    if(!autoJoinLeaveHookedOnApi){
        API.on(API.USER_JOIN, someoneJoined);
        API.on(API.USER_LEAVE, someoneLeft);
        autoJoinLeaveHookedOnApi = true;
    }
    
    if(!waitListUpdateHookedOnApi){
        API.on(API.WAIT_LIST_UPDATE, waitListUpdate);
        waitListUpdateHookedOnApi = true;
    }
}
function startAutoWoot(){
    settings.autoW = true;
    woot();
    $("#hybrisAutoWoot").css("background-color", "#105D2F");
}
function stopAutoWoot(){
    settings.autoW = false;
    $("#hybrisAutoWoot").css("background-color", "#5D102F");
}
function switchAutoWoot(){
    settings.changedAutoW = true;
    if(settings.autoW){
        stopAutoWoot();
    }else{
        startAutoWoot();
    }
    saveSettings();
}
function startAutoNotice(){
    settings.autoNotice = autoNotice.onMention;
    $("#hybrisMention").css("background-color", "#105D2F");
}
function autoNoticeOnChat(){
    settings.autoNotice = autoNotice.onChat;
    $("#hybrisMention").css("background-color", "#102F5D");
}
function stopAutoNotice(){
    settings.autoNotice = autoNotice.disabled;
    $("#hybrisMention").css("background-color", "#5D102F");
}
function switchAutoNotice(){
    settings.changedAutoNotice = true;
    // Cycle between AutoNotice values
	if(settings.autoNotice == autoNotice.onMention){
        autoNoticeOnChat();
    }else if(settings.autoNotice == autoNotice.onChat){
		stopAutoNotice();
	}else{
		startAutoNotice();
	}
    saveSettings();
}
function startAutoNoticeJoinersLeavers(){
    settings.autoJoinLeaveNotice = autoJoinLeaveNotice.all;
    $("#hybrisJoiners").css("background-color", "#105D2F");
}
function filterAutoNoticeJoinersLeavers(){
    settings.autoJoinLeaveNotice = autoJoinLeaveNotice.moderators;
    $("#hybrisJoiners").css("background-color", "#102F5D");
}
function stopAutoNoticeJoinersLeavers(){
    settings.autoJoinLeaveNotice = autoJoinLeaveNotice.disabled;
    $("#hybrisJoiners").css("background-color", "#5D102F");
}
function switchAutoNoticeJoinersLeavers(){
    settings.changedAutoJoinLeaveNotice = true;
    if(settings.autoJoinLeaveNotice == autoJoinLeaveNotice.all){
        filterAutoNoticeJoinersLeavers();
    }else if(settings.autoJoinLeaveNotice == autoJoinLeaveNotice.moderators){
        stopAutoNoticeJoinersLeavers();
    }else{
        startAutoNoticeJoinersLeavers();
    }
    saveSettings();
}
function startAutoHUI(){
    settings.autoHUI = true;
    hideUI();
    $("#hybrisUIToggle").css("background-color", "#105D2F");
}
function stopAutoHUI(){
    settings.autoHUI = false;
    showUI();
    $("#hybrisUIToggle").css("background-color", "#5D102F");
}
function switchAutoHUI(){
    settings.changedAutoHUI = true;
    if(!settings.autoHUI){
        startAutoHUI();
    }else{
        stopAutoHUI();
    }
    saveSettings();
}
function startAutoWL(){
    settings.autoWL = true;
    $("#hybrisWaitList").css("background-color", "#105D2F");
}
function stopAutoWL(){
    settings.autoWL = false;
    $("#hybrisWaitList").css("background-color", "#5D102F");
}
function switchAutoWaitList(){
    settings.changedAutoWL = true;
    if(!settings.autoWL){
        startAutoWL();
    }else{
        stopAutoWL();
    }
    saveSettings();
}
function startAutoJoin(){
    settings.autoJ = true;
    join();
    $("#hybrisAutoJoin").css("background-color", "#105D2F");
}
function stopAutoJoin(){
    settings.autoJ = false;
    $("#hybrisAutoJoin").css("background-color", "#5D102F");
}
function switchAutoJoin(){
    settings.changedAutoJ = true;
    if(settings.autoJ){
        stopAutoJoin();
    }else{
        startAutoJoin();
    }
    saveSettings();
}
/**
 * UI Management
 */
function getAppWidth(){
    return $("#app").width();
}
function getAppHeight(){
    return $("#app").height();
}
function getChatWidth(){
    return $("#chat").width();
}
function getChatHeight(){
    return $("#chat").height();
}
function getChatHeaderHeight(){
    return $("#chat-header").height();
}
function getChatInputHeight(){
	return $("#chat-input").height();
}
function getFooterHeight(){
    return $("#footer").height();
}
function getIconWidth(){
    return $(".icon").width();
}
function getIconHeight(){
    return $(".icon").height();
}
function getButtonWidth(){
    var marginRight = $(".chat-header-button").css("margin-right");
    marginRight = marginRight.substring(0, marginRight.length - 2);
    marginRight = parseInt(marginRight);
    return getIconWidth() + marginRight;
}
var hybrisHeaderHeight = 46;
var hybrisHeaderLeftPadding = 10;
var sizeAboveChatInput = 10;
function hideToolTip(){
	$("#tooltip").remove();
}
function getTooltipLeftPos(buttonNumber){
    var nbButtons = buttonNumber * getButtonWidth();
    return hybrisHeaderLeftPadding + nbButtons + (getIconWidth() / 2);
}
function getTooltipTopPos(){
    var hybrisHeader = $("#hybrisHeader");
    var topString = hybrisHeader.css("top");
    topString = topString.substring(0, topString.length - 2);
    var topInt = parseInt(topString);
    return topInt - (getIconHeight() / 2) - sizeAboveChatInput;
}
var buttonsLibrary;
if(!buttonsLibrary){
    buttonsLibrary = new Map();
}
function Button(htmlId, htmlClass, clickFunction, toolTipInfo, buttonNumber){
    this.htmlId = htmlId;
    this.htmlClass = htmlClass;
    this.number = buttonNumber;
    
    if($("#"+this.htmlId).length == 0){
        $("#hybrisButtonsContainer").append("<div id=\"" + this.htmlId + "\" class=\"chat-header-button\"><i class=\"icon " + this.htmlClass + "\"></i></div>");
    }
    this.updateClick(clickFunction);
    this.updateToolTip(toolTipInfo);
    $("#"+this.htmlId).unbind('mouseleave.hybris');
    $("#"+this.htmlId).bind('mouseleave.hybris', hideToolTip);
}

Button.prototype.updateClass = function(htmlClass){
    var icon = $("#" + this.htmlId + " i");
    if(icon.length > 0){
        icon[0].className = "icon " + htmlClass;
        this.htmlClass = htmlClass;
    }
};

Button.prototype.updateClick = function(clickFunction){
    var button = $("#" + this.htmlId);
    button.unbind('click.hybris');
    button.bind('click.hybris', clickFunction);
    this.clickFunction = clickFunction;
};

Button.prototype.updateToolTip = function(toolTipInfo){
    var buttonNumber = this.number;
    var button = $("#" + this.htmlId);
    button.unbind('mouseenter.hybris');
    button.bind('mouseenter.hybris', function(){
        hideToolTip();
        var tooltipLeftPos = getTooltipLeftPos(buttonNumber);
        var tooltipTopPos = getTooltipTopPos();
        $("body").append("<div id=\"tooltip\"><span>" + toolTipInfo + "</span><div class=\"corner\"></div></div>");
        $("#tooltip").css("left", tooltipLeftPos + "px");
        $("#tooltip").css("top", tooltipTopPos + "px");
    });
    this.toolTipInfo = toolTipInfo;
};

function setupButton(htmlId, htmlClass, clickFunction, toolTipInfo){
    if(buttonsLibrary.has(htmlId)){
        var button = buttonsLibrary[htmlId];
        try{
            button.updateClass(htmlClass);
            button.updateClick(clickFunction);
            button.updateToolTip(toolTipInfo);
        }
        catch(exc){
            buttonsLibrary.delete(htmlId);
        }
    }
    
    if(!buttonsLibrary.has(htmlId)){
        var buttonNumber = buttonsLibrary.size;
        var button = new Button(htmlId, htmlClass, clickFunction, toolTipInfo, buttonNumber);
        buttonsLibrary.set(htmlId, button);
    }
}
var buttonMarginRight;
if(!buttonMarginRight){
    var str = $(".chat-header-button").css("margin-right");
    str = str.substring(0, str.length - 2);
    buttonMarginRight = parseInt(str);
}
var buttonWidth = $(".chat-header-button").width();
function setupHybrisToolBar(){
    var hybrisHeader = $("#hybrisHeader");
    if(hybrisHeader.length > 0){// Reload
        hybrisHeader.remove();
        buttonsLibrary.clear();
    }else{// First load
        $('head').append('<style type="text/css" id="hybrisPlug-css">#playback.hide-video,#playback .hide-video,#audience-canvas.hide-video,#audience-canvas .hide-video,#dj-canvas.hide-video,#dj-canvas .hide-video{height:0 !important}</style>');
    }
    hybrisHeader = $("#hybrisHeader");
    if(hybrisHeader.length == 0){
        $("#room").append("<div id=\"hybrisHeader\"></div>");
        hybrisHeader = $("#hybrisHeader");
    }
    hybrisHeader.hide();
    hybrisHeader.css("position", "absolute");
    var djbuttonTopString = $("#dj-button").css("top");
    djbuttonTopString = djbuttonTopString.substring(0, djbuttonTopString.length - 2);
    var djbuttonTopInt = parseInt(djbuttonTopString);
    hybrisHeader.css("top", (djbuttonTopInt - 50) + "px");
    hybrisHeader.css("z-index", 9);
    hybrisHeader.css("background-color", "#282C35");
    hybrisHeader.css("padding-left", hybrisHeaderLeftPadding + "px");
    hybrisHeader.css("border-top-right-radius", "4px");
    hybrisHeader.css("border-bottom-right-radius", "4px");
    
    var hybrisButtonsContainer = $("#hybrisButtonsContainer");
    if(hybrisButtonsContainer.length == 0){
        hybrisHeader.append("<div id=\"hybrisButtonsContainer\" />");
        hybrisButtonsContainer = $("#hybrisButtonsContainer");
    }
    
    setupButton("hybrisAutoWoot", "icon-woot-disabled", switchAutoWoot, "AutoWoot");
    if(canAutoJoin()) {
        setupButton("hybrisAutoJoin", "icon-about-white", switchAutoJoin, "AutoJoin");
    }
    setupButton("hybrisMention", "icon-chat-sound-on", switchAutoNotice, "Chat sound notification");
    setupButton("hybrisJoiners", "icon-ignore", switchAutoNoticeJoinersLeavers, "Joiners/Leavers notification");
    setupButton("hybrisUIToggle", "icon-logout-white", switchAutoHUI, "Hide User Interface");
    setupButton("hybrisWaitList", "icon-waitlist", switchAutoWaitList, "Follow WaitList");
    setupButton("hybrisEta", "icon-history-white", getEta, "ETA?");
    setupButton("hybrisMehBtn", "icon-meh", askCurrentMehs, "Mehs?");
    setupButton("hybrisGrabBtn", "icon-grab", askCurrentGrabs, "Grabs?");
    setupButton("hybrisAbout", "icon-ep-small", aboutHybris, "Help");
    hybrisHeader.css("height", hybrisHeaderHeight + "px");
    
    var toggleHybrisBar = $("#toggleHybrisBar");
    if(toggleHybrisBar.length == 0){
        hybrisHeader.append("<div id=\"toggleHybrisBar\"><i class=\"icon icon-next-track\" /></div>");
        toggleHybrisBar = $("#toggleHybrisBar");
    }
    toggleHybrisBar.css("background-color", "#282C35");
    toggleHybrisBar.css("position", "relative");
    toggleHybrisBar.css("padding-top", "8px");
    toggleHybrisBar.css("padding-bottom", "8px");
    toggleHybrisBar.css("width", "30px");
    toggleHybrisBar.css("height", "30px");
    toggleHybrisBar.css("float", "left");
    var toggleSideBorder = 1;
    toggleHybrisBar.css("border-left", toggleSideBorder + "px solid black");
    toggleHybrisBar.css("cursor", "pointer");
    toggleHybrisBar.css("border-top-right-radius", "4px");
    toggleHybrisBar.css("border-bottom-right-radius", "4px");
    toggleHybrisBar.unbind('click.hybris');
    toggleHybrisBar.bind('click.hybris', function(){
        var toggleHybrisBar = $("#toggleHybrisBar");
        var buttonContainer = $("#hybrisButtonsContainer");
        var nbButtons = buttonsLibrary.size;
        $("#hybrisHeader").css("width", ((nbButtons * buttonMarginRight) + (nbButtons * buttonWidth) + toggleHybrisBar.width() + toggleSideBorder) + "px");
        settings.showToolbar = !settings.showToolbar;
        saveSettings();
        if(settings.showToolbar){
            buttonContainer.show();// TODO - Add an animation on the toggle to make it slide left/right
        }else{
            buttonContainer.hide();// TODO - Add an animation on the toggle to make it slide left/right
            $("#hybrisHeader").css("width", (toggleHybrisBar.width() + toggleSideBorder) + "px");
        }
    });
    toggleHybrisBar.unbind('mouseleave.hybris');
    toggleHybrisBar.bind('mouseleave.hybris', hideToolTip);
    toggleHybrisBar.unbind('mouseenter.hybris');
    toggleHybrisBar.bind('mouseenter.hybris', function(){
        hideToolTip();
        var buttonContainer = $("#hybrisButtonsContainer");
        var tooltipTopPos = getTooltipTopPos();
        var tooltipLeftPos = 0;
        var tooltipText = "";
        if(buttonContainer.css("display") == "block"){
            tooltipLeftPos = getTooltipLeftPos(buttonsLibrary.size);
            tooltipText = "Hide Hybris Toolbar";
        }else{
            tooltipLeftPos = getTooltipLeftPos(0);
            tooltipText = "Show Hybris Toolbar";
        }
        $("body").append("<div id=\"tooltip\"><span>" + tooltipText + "</span><div class=\"corner\"></div></div>");
        $("#tooltip").css("left", tooltipLeftPos + "px");
        $("#tooltip").css("top", tooltipTopPos + "px");
    });
    
    var nbButtons = buttonsLibrary.size;
    hybrisHeader.css("width", ((nbButtons * buttonMarginRight) + (nbButtons * buttonWidth) + toggleHybrisBar.width() + toggleSideBorder) + "px");
    if(settings.showToolbar){
        hybrisButtonsContainer.show();
    }else{
        hybrisButtonsContainer.hide();
        $("#hybrisHeader").css("width", (toggleHybrisBar.width() + toggleSideBorder) + "px");
    }
    hybrisHeader.slideDown();
}
function loadToggleModes(){
    if(settings.changedAutoW){
        if(settings.autoW){
            startAutoWoot();
        }else{
            stopAutoWoot();
        }
    }else{
        stopAutoWoot();
    }
    
    if(settings.changedAutoJ){
        if(settings.autoJ){
            startAutoJoin();
        }else{
            stopAutoJoin();
        }
    }else{
        stopAutoJoin();
    }
    
    if(settings.changedAutoNotice){
        if(settings.autoNotice == autoNotice.onMention){
            startAutoNotice();
        }else if(settings.autoNotice == autoNotice.onChat){
            autoNoticeOnChat();
        }else{
            stopAutoNotice();
        }
    }else{
        stopAutoNotice();
    }
    
    if(settings.changedAutoJoinLeaveNotice){
        if(settings.autoJoinLeaveNotice == autoJoinLeaveNotice.all){
            startAutoNoticeJoinersLeavers();
        }else if(settings.autoJoinLeaveNotice == autoJoinLeaveNotice.moderators){
            filterAutoNoticeJoinersLeavers();
        }else{
            stopAutoNoticeJoinersLeavers();
        }
    }else{
        stopAutoNoticeJoinersLeavers();
    }
    
    if(settings.changedAutoHUI){
        if(settings.autoHUI){
            startAutoHUI();
        }else{
            stopAutoHUI();
        }
    }else{
        stopAutoHUI();
    }
    
    if(settings.changedAutoWL){
        if(settings.autoWL){
            startAutoWL();
        }else{
            stopAutoWL();
        }
    }else{
        stopAutoWL();
    }
    
    // Saves in a JSON file all the settings
    saveSettings();
}
/**
 * Main function (executed at loading)
 */
function main(){
    loadSettings();
    setupHybrisToolBar();
    refreshAPIStatus();
    loadToggleModes();
}
$(document).ready(main);// TODO - Reload the script if you change room (refresh UI)
