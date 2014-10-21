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

var changedAutoW;
var autoW;

var changedAutoNotice;
var autoNotice;

var changedAutoJoinLeaveNotice;
var autoJoinLeaveNotice;

var changedAutoHUI;
var autoHUI;

/**
 * Just a chill room features
 */
function isInChill(){
	return window.location.pathname == "/new-to-this-shit-mrsuicidesheep";
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
        API.chatLog("Estimated Time Awaiting : " + nbOfHours + ":" + nbOfMinutes + ":" + nbOfSec, true);
    };
}

function askCurrentMehs(){
    var audience = API.getAudience();
    var atLeastOneMeh = false;
    for(var i = 0; i < audience.length; i++){
        var user = audience[i];
        if(user.vote == -1){
            API.chatLog(user.username + " mehed this song");
            atLeastOneMeh = true;
        }
    }
    if(!atLeastOneMeh){
        API.chatLog("None mehed this song");
    }
}
function askCurrentGrabs(){
    var audience = API.getAudience();
    var atLeastOneGrab = false;
    for(var i = 0; i < audience.length; i++){
        var user = audience[i];
        if(user.grab){
            API.chatLog(user.username + " grabbed this song");
            atLeastOneGrab = true;
        }
    }
    if(!atLeastOneGrab){
        API.chatLog("None grabbed this song");
    }
}

/**
 * ADVANCE EVENT :
 * AutoWoot and AutoHideUI
 */
var advanceEventHookedOnApi;
var advanceFunction;
if(!advanceFunction){
    advanceFunction = function() {
        if(autoHUI){
            hideUI();
        }else{
            showUI();
        }
        
        if(autoW){
            woot();
        }
    };
}

function woot() {
    $("#woot").click();
}

var videoHeight;
var videoWidth;
function hideVideo() {
    if(!videoHeight){
        videoHeight = $("#playback-container").css("height");
    }
    if(!videoWidth){
        videoWidth = $("#playback-container").css("width");
    }
    $("#playback-container").css("height", "0");
    $("#playback-container").css("width", "0");
}

function showVideo() {
    hideVideo();
    if(videoHeight){
        $("#playback-container").css("height", videoHeight);
    }else{
        $("#playback-container").css("height", "100%");
    }
    
    if(videoWidth){
        $("#playback-container").css("width", videoWidth);
    }else{
        $("#playback-container").css("width", "100%");
    }
}

var background;
var playbackBGHeight;
var playbackBGWidth;
function hideBG() {
    var playbackImg = $("#playback > div:nth-child(1) > img:nth-child(1)");
    if(!background){
        background = $(".room-background").css("background-image");
    }
    $(".room-background").css("background-image","");
    if(!playbackBGHeight){
        playbackBGHeight = playbackImg.css("height");
    }
    if(!playbackBGWidth){
        playbackBGWidth = playbackImg.css("width");
    }
    playbackImg.css("height", "0");
    playbackImg.css("width", "0");
}

function showBG() {
    hideBG();
    if(background){
        $(".room-background").css("background-image", background);
    }else{
        $(".room-background").css("background-image", "url(\"https://cdn.plug.dj/_/static/images/community/custom/2014hw/background.29748a148b0c5440ddc5899e07bc32b1a1d4b86c.jpg\")");// Halloween BG
    }
    var playbackImg = $("#playback > div:nth-child(1) > img:nth-child(1)");
    if(playbackBGHeight){
        playbackImg.css("height", playbackBGHeight);
    }else{
        playbackImg.css("height", "100%");
    }
    if(playbackBGWidth){
        playbackImg.css("width", playbackBGWidth);
    }else{
        playbackImg.css("width", "100%");
    }
}

var audienceHeight;
var audienceWidth;
var djboothHeight;
var djboothWidth;
function hideAvatars() {
    if(!audienceHeight){
        audienceHeight = $("#audience-canvas").css("height");
    }
    if(!audienceWidth){
        audienceWidth = $("#audience-canvas").css("width");
    }
    $("#audience-canvas").css("height", "0");
    $("#audience-canvas").css("width", "0");
    if(!djboothHeight){
        djboothHeight = $("#dj-canvas").css("height");
    }
    if(!djboothWidth){
        djboothWidth = $("#dj-canvas").css("width");
    }
    $("#dj-canvas").css("height", "0");
    $("#dj-canvas").css("width", "0");
}

function showAvatars() {
    hideAvatars();
    if(audienceHeight){
        $("#audience-canvas").css("height", audienceHeight);
    }else{
        $("#audience-canvas").css("height", "100%");
    }
    if(audienceWidth){
        $("#audience-canvas").css("width", audienceWidth);
    }else{
        $("#audience-canvas").css("width", "100%");
    }
    if(djboothHeight){
        $("#dj-canvas").css("height", djboothHeight);
    }else{
        $("#dj-canvas").css("height", "100%");
    }
    if(djboothWidth){
        $("#dj-canvas").css("width", djboothWidth);
    }else{
        $("#dj-canvas").css("width", "100%");
    }
}

function hideUI(){
    hideVideo();
    hideBG();
    hideAvatars();
}
function showUI(){
    showVideo();
    showBG();
    showAvatars();
}

/**
 * JOIN EVENT :
 * AutoJoinNotice
 */
var autoJoinLeaveHookedOnApi;
var someoneJoined;
if(!someoneJoined){
    someoneJoined = function(user){
    	if(autoJoinLeaveNotice) {
            API.chatLog(user.username + " joined the room", true);
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
    	if(autoJoinLeaveNotice) {
            API.chatLog(user.username + " left the room", false);
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
        
        // Watch PMs
        if(message.match("@" + ownUserName))
        {
            if(debug){console.log(username + " told me : " + message);}
            // AutoNotice
            if(autoNotice){
                loadedSound.play();
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
}
function startAutoWoot(){
    autoW = true;
    $("#hybrisAutoWoot").css("background-color", "#105D2F");
    woot();
}
function stopAutoWoot(){
    autoW = false;
    $("#hybrisAutoWoot").css("background-color", "#5D102F");
}
function switchAutoWoot(){
    changedAutoW = true;
    if(autoW){
        stopAutoWoot();
    }else{
        startAutoWoot();
    }
}
function startAutoNotice(){
    autoNotice = true;
    $("#hybrisMention").css("background-color", "#105D2F");
}
function stopAutoNotice(){
    autoNotice = false;
    $("#hybrisMention").css("background-color", "#5D102F");
}
function switchAutoNotice(){
    changedAutoNotice = true;
	if(autoNotice){
		stopAutoNotice();
	}else{
		startAutoNotice();
	}
}
function startAutoNoticeJoinersLeavers(){
    autoJoinLeaveNotice = true;
    $("#hybrisJoiners").css("background-color", "#105D2F");
}
function stopAutoNoticeJoinersLeavers(){
    autoJoinLeaveNotice = false;
    $("#hybrisJoiners").css("background-color", "#5D102F");
}
function switchAutoNoticeJoinersLeavers(){
    changedAutoJoinLeaveNotice = true;
    if(autoJoinLeaveNotice){
        stopAutoNoticeJoinersLeavers();
    }else{
        startAutoNoticeJoinersLeavers();
    }
}
function startAutoHUI(){
    autoHUI = true;
    $("#hybrisUIToggle").css("background-color", "#105D2F");
    hideUI();
}
function stopAutoHUI(){
    autoHUI = false;
    $("#hybrisUIToggle").css("background-color", "#5D102F");
    showUI();
}
function switchAutoHUI(){
    changedAutoHUI = true;
    if(!autoHUI){
        startAutoHUI();
    }else{
        stopAutoHUI();
    }
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
var hybrisHeaderLeftPos = 10;
var nbOfBorders = 2;
var sizeAboveChatInput = 10;
function hideToolTip(){
	$("#tooltip").remove();
}
function getTooltipLeftPos(buttonNumber){
    var nbButtons = buttonNumber * getButtonWidth();
    return getAppWidth() - getChatWidth() + hybrisHeaderLeftPos + nbButtons + (getIconWidth() / 2);
}
function getTooltipTopPos(){
    return getChatHeight() - (getIconHeight() / 2) - sizeAboveChatInput;
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
        $("#hybrisHeader").append("<div id=\"" + this.htmlId + "\" class=\"chat-header-button\"><i class=\"icon " + this.htmlClass + "\"></i></div>");
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
        button.updateClass(htmlClass);
        button.updateClick(clickFunction);
        button.updateToolTip(toolTipInfo);
    }else{
        var buttonNumber = buttonsLibrary.size;
        var button = new Button(htmlId, htmlClass, clickFunction, toolTipInfo, buttonNumber);
        buttonsLibrary.set(htmlId, button);
    }
}
var alreadyMovedSuggestion;
function setupHybrisToolBar(){
	var chatHeight = getChatHeight();
	var chatHeaderHeight = getChatHeaderHeight();
	var chatInputHeight = getChatInputHeight();
	
	var newChatMessagesHeight = chatHeight - chatHeaderHeight - chatInputHeight - hybrisHeaderHeight - nbOfBorders - sizeAboveChatInput;
	
	if(!alreadyMovedSuggestion){
		var suggestionBottom = $("#chat-suggestion").css("bottom");
		suggestionBottom = suggestionBottom.substring(0, suggestionBottom.length - 2);
		suggestionBottom = parseInt(suggestionBottom);
		$("#chat-suggestion").css("bottom", suggestionBottom + hybrisHeaderHeight);
		alreadyMovedSuggestion = true;
	}

    var currentMessagesHeight = $("#chat-messages").height();
    if(currentMessagesHeight != newChatMessagesHeight){
        $("#chat-messages").fadeOut("fast").promise().done(function(){
            $("#chat-messages").css("height", newChatMessagesHeight + "px");
            $("#chat-messages").fadeIn("slow");
        });
        $("#chat-input").fadeOut("fast").promise().done(function(){
            $("#chat-input").css("bottom", hybrisHeaderHeight + "px");
            $("#chat-input").fadeIn("slow");
        });
    }
    if($("#hybrisHeader").length == 0){
        $("#chat").append("<div id=\"hybrisHeader\"><div class=\"divider\" /></div>");
    }
    $("#hybrisHeader").hide();
    $("#hybrisHeader").css("position", "absolute");
    $("#hybrisHeader").css("height", hybrisHeaderHeight + "px");
    $("#hybrisHeader").css("bottom", "0px");
    $("#hybrisHeader").css("left", hybrisHeaderLeftPos + "px");
    $("#hybrisHeader").css("width", "100%");
    setupButton("hybrisAutoWoot", "icon-woot-disabled", switchAutoWoot, "AutoWoot");
    setupButton("hybrisMention", "icon-chat-sound-on", switchAutoNotice, "Mention sound notification");
    setupButton("hybrisJoiners", "icon-ignore", switchAutoNoticeJoinersLeavers, "Joiners/Leavers notification");
    setupButton("hybrisEta", "icon-history-white", getEta, "Give ETA");
    setupButton("hybrisUIToggle", "icon-logout-white", switchAutoHUI, "Hide User Interface");
    setupButton("hybrisMehBtn", "icon-meh", askCurrentMehs, "Mehs?");
    setupButton("hybrisGrabBtn", "icon-grab", askCurrentGrabs, "Grabs?");
    $("#hybrisHeader").slideDown();
}
/**
 * Main function (executed at loading)
 */
function main(){
    setupHybrisToolBar();
    refreshAPIStatus();
    
    if(changedAutoW){
        if(autoW){
            startAutoWoot();
        }else{
            stopAutoWoot();
        }
    }else{
        stopAutoWoot();
    }
    
    if(changedAutoNotice){
        if(autoNotice){
            startAutoNotice();
        }else{
            stopAutoNotice();
        }
    }else{
        stopAutoNotice();
    }
    
    if(changedAutoJoinLeaveNotice){
        if(autoJoinLeaveNotice){
            startAutoNoticeJoinersLeavers();
        }else{
            stopAutoNoticeJoinersLeavers();
        }
    }else{
        stopAutoNoticeJoinersLeavers();
    }
    
    if(changedAutoHUI){
        if(autoHUI){
            startAutoHUI();
        }else{
            stopAutoHUI();
        }
    }else{
        stopAutoHUI();
    }
}
$(document).ready(main);
