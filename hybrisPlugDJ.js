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
var currentRoom = window.location.pathname;

var oldWaitList;
var oldMedia;
var upVoteList;
var downVoteList;
var grabsList;
initLists();

/**
 * Just a chill room features
 */
function isInChill(){
	return currentRoom == "/new-to-this-shit-mrsuicidesheep";
}
/**
 * Electro, Dubstep & Techno features
 */
function isInEDT(){
    return currentRoom == "/edtentertainment";
}
/**
 * Tastycat features
 */
function isInTasty(){
    return currentRoom == "/tastycat";
}
/**
 * AnimeMusic.me and Japanese Music
 */
function isInHummingBird(){
    return currentRoom == "/hummingbird-me";
}
/**
 * Trance House Chill
 */
function isInTranceHouseChill(){
    return currentRoom == "/trancehousechill";
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
var autoSongStat = {
    disabled: false,
    all: 1,
    self: 2
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
    
    changedAutoSStat: false,
    autoSongStat: autoSongStat.disabled,
    
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
 * Main functions
 */
function woot() {// TODO - Fix the fact that it doesnt woot correctly after changing room (random bug)
    if(document.getElementById('woot') && API.enabled){
        $("#woot").click();
    }else{
        window.setTimeout(woot, 200);
    }
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
    if(canAutoJoin()){
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

function askCurrentMehs(){
    var media = oldMedia;
    var author = media.author;
    var title = media.title;
    API.chatLog(":thumbsdown: " + author + " - " + title, true);
    downVoteList.forEach(function(value){API.chatLog(value + " mehed");});
    if(downVoteList.length == 0){
        API.chatLog("Nobody mehed");
    }
}
function askCurrentGrabs(){
    var media = oldMedia;
    var author = media.author;
    var title = media.title;
    API.chatLog(":thumbsup: " + author + " - " + title, true);
    grabsList.forEach(function(value){API.chatLog(value + " grabbed");});
    if(grabsList.length == 0){
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
    API.chatLog("Follow Song Stat - Green: all, Blue: self, Red: deactivated");
    API.chatLog("ETA? - Get the Estimated Time Awaiting from the current position");
    API.chatLog("Grabs? - Get the list of people who grabbed the current media");
    API.chatLog("Mehs? - Get the list of people who mehed the current media");
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

/**
 * CHANGE ROOM EVENT :
 * AutoWoot
 * AutoJoin
 * Update the oldWaitList
 * Update the oldMedia
 */
function changeRoomFunction() {
    var nextExec = 500;
    if(currentRoom != window.location.pathname){
        if(document.getElementById('room-loader')){
            if(debug){console.log("Changing from room : " + currentRoom + " to " + window.location.pathname);}
            nextExec = 1000;
        }else{
            if(debug){console.log("Changed from room : " + currentRoom + " to " + window.location.pathname);}
            currentRoom = window.location.pathname;
            initLists();
            setupHybrisToolBar();
        }
    }
    window.setTimeout(changeRoomFunction, nextExec);
}
changeRoomFunction();

/**
 * FRIEND JOIN EVENT :
 * AutoFriendList
 */
var friendJoinEventHookedOnApi;
var friendJoinFunction;
if(friendJoinFunction && friendJoinEventHookedOnApi){
    API.off(API.FRIEND_JOIN, friendJoinFunction);
    friendJoinEventHookedOnApi = false;
}
friendJoinFunction = function(data) {
    if(debug){console.log("Friend joint event");console.log(data);}
    
    // TODO - Follow the friend list
};
if(!friendJoinEventHookedOnApi){
    API.on(API.FRIEND_JOIN, friendJoinFunction);
    friendJoinEventHookedOnApi = true;
}

/**
 * GRAB EVENT :
 * AutoSongStat
 * AskCurrentGrabs
 */
var grabEventHookedOnApi;
var grabFunction;
if(grabFunction && grabEventHookedOnApi){
    API.off(API.GRAB_UPDATE, grabFunction);
    grabEventHookedOnApi = false;
}
grabFunction = function(data){
    if(debug){console.log("Grab event");console.log(data);}
    
    var grabUserName = data.user.username;
    if(grabsList.indexOf(grabUserName) != -1){
        grabsList.pop(grabUserName);
    }
    grabsList.push(grabUserName);
};
if(!grabEventHookedOnApi){
    API.on(API.GRAB_UPDATE, grabFunction);
    grabEventHookedOnApi = true;
}

/**
 * VOTE EVENT :
 * AutoSongStat
 * AskCurrentMehs
 */
var voteEventHookedOnApi;
var voteFunction;
if(voteFunction && voteEventHookedOnApi){
    API.off(API.VOTE_UPDATE, voteFunction);
    voteEventHookedOnApi = false;
}
voteFunction = function(data){
    if(debug){console.log("Vote event");console.log(data);}
    
    var voteUserName = data.user.username;
    if(upVoteList.indexOf(voteUserName) != -1){
        upVoteList.pop(voteUserName);
    }
    if(downVoteList.indexOf(voteUserName) != -1){
        downVoteList.pop(voteUserName);
    }
    if(data.vote == 1){
        upVoteList.push(voteUserName);
    }
    else if(data.vote == -1){
        downVoteList.push(voteUserName);
    }
};
if(!voteEventHookedOnApi){
    API.on(API.VOTE_UPDATE, voteFunction);
    voteEventHookedOnApi = true;
}

function initLists(){
    oldWaitList = API.getWaitList();
    oldMedia = API.getMedia();
    upVoteList = new Array();
    downVoteList = new Array();
    grabsList = new Array();
    var audience = API.getAudience();
    for(var i = 0; i < audience.length; i++){
        var user = audience[i];
        if(user.vote == -1){
            downVoteList.push(user.username);
        }
        else if(user.vote == 1){
            upVoteList.push(user.username);
        }
        if(user.grab){
            grabsList.push(user.username);
        }
    }
}

/**
 * ADVANCE EVENT :
 * AutoWoot
 * AutoHideUI
 * AutoSongStat
 */
var advanceEventHookedOnApi;
var advanceFunction;
if(advanceFunction && advanceEventHookedOnApi){
    API.off(API.ADVANCE, advanceFunction);
    advanceEventHookedOnApi = false;
}
advanceFunction = function(data) {
    if(debug){console.log("Advance event");console.log(data);}
    
    if(data.lastPlay != undefined)// Just finished playing
    {
        var lastPlay = data.lastPlay;
        if((settings.autoSongStat == autoSongStat.self && lastPlay.dj.username == ownUserName) || settings.autoSongStat == autoSongStat.all){
            askCurrentGrabs();
            askCurrentMehs();
        }
        
        if(settings.autoJ){
            join();
        }
    }
    else// Just started a new play
    {
        upVoteList = new Array();
        downVoteList = new Array();
        grabsList = new Array();
        oldMedia = API.getMedia();
        
        if(settings.autoHUI){
            hideUI();
        }else{
            showUI();
        }
        
        if(settings.autoW){
            woot();
        }
    }
};
if(!advanceEventHookedOnApi){
    API.on(API.ADVANCE, advanceFunction);
    advanceEventHookedOnApi = true;
}

/**
 * JOIN EVENT :
 * AutoJoinNotice
 */
var joinHookedOnApi;
var someoneJoined;
if(someoneJoined && joinHookedOnApi){
    API.off(API.USER_JOIN, someoneJoined);
    joinHookedOnApi = false;
}
someoneJoined = function(user){
    if(debug){console.log("Join event");console.log(user);}
    if((settings.autoJoinLeaveNotice == autoJoinLeaveNotice.all) || (settings.autoJoinLeaveNotice == autoJoinLeaveNotice.moderators && user.role > 0)) {
        API.chatLog(":on: " + user.username + " joined the room", true);
    }
};
if(!joinHookedOnApi){
    API.on(API.USER_JOIN, someoneJoined);
    joinHookedOnApi = true;
}

/**
 * LEAVE EVENT :
 * AutoLeaveNotice
 */
var leftHookedOnApi;
var someoneLeft;
if(someoneLeft && leftHookedOnApi){
    API.off(API.USER_LEAVE, someoneLeft);
    leftHookedOnApi = false;
}
someoneLeft = function(user){
    if(debug){console.log("Leave event");console.log(user);}
    if((settings.autoJoinLeaveNotice == autoJoinLeaveNotice.all) || (settings.autoJoinLeaveNotice == autoJoinLeaveNotice.moderators && user.role > 0)) {
        API.chatLog(":end: " + user.username + " left the room", false);
    }
};
if(!leftHookedOnApi){
    API.on(API.USER_LEAVE, someoneLeft);
    leftHookedOnApi = true;
}

/**
 * WAIT LIST UPDATE EVENT :
 * AutoWaitList
 * AutoJoin
 */
var waitListUpdateHookedOnApi;
var waitListUpdate;
if(waitListUpdate && waitListUpdateHookedOnApi){
    API.off(API.WAIT_LIST_UPDATE, waitListUpdate);
    waitListUpdateHookedOnApi = false;
}
waitListUpdate = function(newWaitList){
    if(debug){console.log("WaitListUpdate event");console.log(newWaitList);}
    
    // Recovers the addition in the new waitlist
    if(settings.autoWL){
        var currentDJ = API.getDJ();
        var currentHistory = API.getHistory();
        var lastDJ = currentDJ;
        if(currentHistory.length > 0){
            var lastHistory = currentHistory[0];
            lastDJ = lastHistory.user;
            if(currentHistory.length > 1 && currentDJ != undefined && lastDJ.id == currentDJ.id){
                lastHistory = currentHistory[1];
                lastDJ = lastHistory.user;
            }
        }
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
                if(lastDJ != undefined && lastDJ.id == userWaiting.id){
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
                if(currentDJ != undefined && currentDJ.id == userWasWaiting.id){
                    API.chatLog(":cool: " + userWasWaiting.username + " left the waitlist to become a DJ");
                }else{
                    API.chatLog(":free: " + userWasWaiting.username + " left the waitlist");
                }
            }
        }
    }
    oldWaitList = newWaitList;
    
    if(settings.autoJ){
        join();
    }
};
if(!waitListUpdateHookedOnApi){
    API.on(API.WAIT_LIST_UPDATE, waitListUpdate);
    waitListUpdateHookedOnApi = true;
}

/**
 * CHAT EVENT :
 * AutoNotice Only -> http://pastebin.com/Hsi2YMDH
 */
var chatEventHookedOnApi;
var analyseChat;
if(analyseChat && chatEventHookedOnApi){
    API.off(API.CHAT, analyseChat);
    chatEventHookedOnApi = false;
}
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
        if(type.startsWith("message")){
            // AutoNotice (on every chat message)
            if(settings.autoNotice == autoNotice.onChat){
                loadedSound.play();
            }
        }
        else if(type.startsWith("mention")){
            // AutoNotice (on mention message)
            if(settings.autoNotice == autoNotice.onMention || settings.autoNotice == autoNotice.onChat){
                loadedSound.play();
            }
        }
        else if(type.startsWith("emote")){
            // AutoNotice (on mention message)
            if(settings.autoNotice == autoNotice.onMention){
                if(message.match("@" + ownUserName)){
                    loadedSound.play();
                }
            }
            else if(settings.autoNotice == autoNotice.onChat){
                loadedSound.play();
            }
        }
    }
};
if(!chatEventHookedOnApi){
    API.on(API.CHAT, analyseChat);
    chatEventHookedOnApi = true;
}

/**
 * Toggle/Cycle Functions
 */
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
function startAutoSStat(){
    settings.autoSongStat = autoSongStat.all;
    $("#hybrisSongStat").css("background-color", "#105D2F");
}
function filterAutoSStat(){
    settings.autoSongStat = autoSongStat.self;
    $("#hybrisSongStat").css("background-color", "#102F5D");
}
function stopAutoSStat(){
    settings.autoSongStat = autoSongStat.disabled;
    $("#hybrisSongStat").css("background-color", "#5D102F");
}
function switchAutoSongStat(){
    settings.changedAutoSStat = true;
    if(!settings.autoSongStat){
        startAutoSStat();
    }else if(settings.autoSongStat == autoSongStat.all){
        filterAutoSStat();
    }else{
        stopAutoSStat();
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
function loadToggleModes(){
    if(settings.changedAutoW && settings.autoW){
        startAutoWoot();
    }else{
        stopAutoWoot();
    }
    
    if(settings.changedAutoJ && settings.autoJ){
        startAutoJoin();
    }else{
        stopAutoJoin();
    }
    
    if(settings.changedAutoNotice && settings.autoNotice){
        if(settings.autoNotice == autoNotice.onMention){
            startAutoNotice();
        }else if(settings.autoNotice == autoNotice.onChat){
            autoNoticeOnChat();
        }else{
            startAutoNotice();
        }
    }else{
        stopAutoNotice();
    }
    
    if(settings.changedAutoJoinLeaveNotice && settings.autoJoinLeaveNotice){
        if(settings.autoJoinLeaveNotice == autoJoinLeaveNotice.all){
            startAutoNoticeJoinersLeavers();
        }else if(settings.autoJoinLeaveNotice == autoJoinLeaveNotice.moderators){
            filterAutoNoticeJoinersLeavers();
        }else{
            startAutoNoticeJoinersLeavers();
        }
    }else{
        stopAutoNoticeJoinersLeavers();
    }
    
    if(settings.changedAutoHUI && settings.autoHUI){
        startAutoHUI();
    }else{
        stopAutoHUI();
    }
    
    if(settings.changedAutoWL && settings.autoWL){
        startAutoWL();
    }else{
        stopAutoWL();
    }
    
    if(settings.changedAutoSStat && settings.autoSongStat){
        if(settings.autoSongStat == autoSongStat.all){
            startAutoSStat();
        }else if(settings.autoSongStat == autoSongStat.self){
            filterAutoSStat();
        }else{
            startAutoSStat();
        }
    }else{
        stopAutoSStat();
    }
    
    // Saves in a JSON file all the settings
    saveSettings();
}
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
    /*var djbuttonTopString = $("#dj-button").css("top");
    djbuttonTopString = djbuttonTopString.substring(0, djbuttonTopString.length - 2);
    var djbuttonTopInt = parseInt(djbuttonTopString);
    hybrisHeader.css("top", (djbuttonTopInt - 50) + "px");*/
	hybrisHeader.css("bottom", "150px");
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
    setupButton("hybrisSongStat", "icon-current-dj", switchAutoSongStat, "Follow Song Stat");
    setupButton("hybrisEta", "icon-history-white", getEta, "ETA?");
    setupButton("hybrisGrabBtn", "icon-grab", askCurrentGrabs, "Grabs?");
    setupButton("hybrisMehBtn", "icon-meh", askCurrentMehs, "Mehs?");
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
    loadToggleModes();
}
/**
 * Main function (executed at loading)
 */
function main(){
    loadSettings();
    setupHybrisToolBar();
}
$(document).ready(main);
