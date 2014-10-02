/**
Copyright © Hybris95
Contact : hybris_95@hotmail.com
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
var lastTimeStamp = false;
var loadedSound = new Audio(decodeURIComponent("https://gmflowplayer.googlecode.com/files/notify.ogg"));

var autoW = false;
var autoNotice = false;
var autoJoinLeaveNotice = false;
/**
 * ADVANCE EVENT :
 * AutoWoot Only -> http://pastebin.com/qNV6T6pq
 */
function autowoot(){
    if(autoW){
        $("#woot").click();
    }
}
/**
 * JOIN EVENT :
 * AutoJoinNotice
 */
function someoneJoined(user){
    API.chatLog(user.username + " joined the room", true);
}
/**
 * LEAVE EVENT :
 * AutoLeaveNotice
 */
function someoneLeft(user){
    API.chatLog(user.username + " left the room", false);
}
/**
 * CHAT EVENT :
 * AutoNotice Only -> http://pastebin.com/Hsi2YMDH
 */
function analyseChat(chat){
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
}
/**
 * Events Management and default status configuration
 */
function refreshAPIStatus()
{
    if(autoW){
        API.on(API.ADVANCE, autowoot);
    }else{
		API.off(API.ADVANCE, autowoot);
	}
	
    if(autoNotice){
        API.on(API.CHAT, analyseChat);
    }else{
		API.off(API.CHAT, analyseChat);
	}
	
    if(autoJoinLeaveNotice){
        API.on(API.USER_JOIN, someoneJoined);
    }else{
		API.off(API.USER_JOIN, someoneJoined);
	}
	
    if(autoJoinLeaveNotice){
        API.on(API.USER_LEAVE, someoneLeft);
    }else{
		API.off(API.USER_LEAVE, someoneLeft);
	}
}
function startAutoWoot(){
    autoW = true;
    $("#hybrisAutoWoot").css("background-color", "#105D2F");
    autowoot();
    refreshAPIStatus();
}
function stopAutoWoot(){
    autoW = false;
    $("#hybrisAutoWoot").css("background-color", "#5D102F");
    refreshAPIStatus();
}
function switchAutoWoot(){
    if(autoW){
        stopAutoWoot();
    }else{
        startAutoWoot();
    }
}
function startAutoNotice(){
    autoNotice = true;
	$("#hybrisMention").css("background-color", "#105D2F");
    refreshAPIStatus();
}
function stopAutoNotice(){
    autoNotice = false;
	$("#hybrisMention").css("background-color", "#5D102F");
    refreshAPIStatus();
}
function switchAutoNotice(){
	if(autoNotice){
		stopAutoNotice();
	}else{
		startAutoNotice();
	}
}
function startAutoNoticeJoinersLeavers(){
    autoJoinLeaveNotice = true;
    $("#hybrisJoiners").css("background-color", "#105D2F");
    refreshAPIStatus();
}
function stopAutoNoticeJoinersLeavers(){
    autoJoinLeaveNotice = false;
    $("#hybrisJoiners").css("background-color", "#5D102F");
    refreshAPIStatus();
}
function switchAutoNoticeJoinersLeavers(){
    if(autoJoinLeaveNotice){
        stopAutoNoticeJoinersLeavers();
    }else{
        startAutoNoticeJoinersLeavers();
    }
}
function hideToolTip(){
	$("#tooltip").remove();
}
function showAutoWootToolTip(){
	hideToolTip();
	$("body").append("<div id=\"tooltip\" style=\"left: 1600px;top: 800px;\"><span>AutoWoot</span><div class=\"corner\"></div></div>");
}
function showAutoNoticeToolTip(){
	hideToolTip();
	$("body").append("<div id=\"tooltip\" style=\"left: 1650px;top: 800px;\"><span>Mention sound notification</span><div class=\"corner\"></div></div>");
}
function showAutoJoinersLeaversToolTip(){
	hideToolTip();
	$("body").append("<div id=\"tooltip\" style=\"left: 1700px;top: 800px;\"><span>Joiners/Leavers notification</span><div class=\"corner\"></div></div>");
}
var alreadyMovedSuggestion;
function setupHybrisToolBar(){
	var appRightHeight = $(".app-right").css("height");
	appRightHeight = appRightHeight.substring(0, appRightHeight.length - 2);
	appRightHeight = parseInt(appRightHeight);
	
	var chatHeaderHeight = $("#chat-header").css("height");
	chatHeaderHeight = chatHeaderHeight.substring(0, chatHeaderHeight.length - 2);
	chatHeaderHeight = parseInt(chatHeaderHeight);
	
	var chatInputHeight = $("#chat-input").css("height");
	chatInputHeight = chatInputHeight.substring(0, chatInputHeight.length - 2);
	chatInputHeight = parseInt(chatInputHeight);
	
	var hybrisHeaderHeight = 46;
	var nbOfBorders = 2;
	var sizeAboveChatInput = 10;
	
	var chatMessagesHeight = appRightHeight - chatHeaderHeight - chatInputHeight - hybrisHeaderHeight - nbOfBorders - sizeAboveChatInput;
	
	if(!alreadyMovedSuggestion){
		var suggestionBottom = $("#chat-suggestion").css("bottom");
		suggestionBottom = suggestionBottom.substring(0, suggestionBottom.length - 2);
		suggestionBottom = parseInt(suggestionBottom);
		$("#chat-suggestion").css("bottom", suggestionBottom + hybrisHeaderHeight);// This makes the  ChatSuggestion go a lil more up to make place for Hybris Toolbar
		alreadyMovedSuggestion = true;
	}

    $("#chat-messages").css("height", chatMessagesHeight + "px");// This resizes the messages area to make place for Hybris Toolbar
    $("#chat-input").css("bottom", hybrisHeaderHeight + "px");// This makes the ChatInput go a lil more up to make place for Hybris Toolbar
    if($("#hybrisHeader").length == 0){
        $("#chat").append("<div id=\"hybrisHeader\"><div class=\"divider\" /></div>");
    }
    $("#hybrisHeader").css("position", "absolute");
    $("#hybrisHeader").css("height", hybrisHeaderHeight + "px");
    $("#hybrisHeader").css("bottom", "0px");
    $("#hybrisHeader").css("left", "10px");
    $("#hybrisHeader").css("width", "100%");
}
function setupAutoWootBtn(){
    if($("#hybrisAutoWoot").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisAutoWoot\" class=\"chat-header-button\"><i class=\"icon icon-hybris-autowoot\"></i></div>");
    }
    $(".icon-hybris-autowoot").css("background", "url('https://cdn.plug.dj/_/static/images/icons.5f9a8e66-2aff-4176-96b8-7859f92becfc.png')");
    $(".icon-hybris-autowoot").css("background-position", "-105px -280px");
    $("#hybrisAutoWoot").unbind('click.hybris');
    $("#hybrisAutoWoot").bind('click.hybris', switchAutoWoot);
	$("#hybrisAutoWoot").unbind('mouseenter.hybris');
	$("#hybrisAutoWoot").bind('mouseenter.hybris', showAutoWootToolTip);
	$("#hybrisAutoWoot").unbind('mouseleave.hybris');
	$("#hybrisAutoWoot").bind('mouseleave.hybris', hideToolTip);
}
function setupAutoNoticeBtn(){
    if($("#hybrisMention").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisMention\" class=\"chat-header-button\"><i class=\"icon icon-hybris-mention\"></i></div>");
    }
    $(".icon-hybris-mention").css("background", "url('https://cdn.plug.dj/_/static/images/icons.5f9a8e66-2aff-4176-96b8-7859f92becfc.png')");
    $(".icon-hybris-mention").css("background-position", "-140px 0px");
    $("#hybrisMention").unbind('click.hybris');
    $("#hybrisMention").bind('click.hybris', switchAutoNotice);
	$("#hybrisMention").unbind('mouseenter.hybris');
	$("#hybrisMention").bind('mouseenter.hybris', showAutoNoticeToolTip);
	$("#hybrisMention").unbind('mouseleave.hybris');
	$("#hybrisMention").bind('mouseleave.hybris', hideToolTip);
}
function setupAutoJoinersLeaversBtn(){
    if($("#hybrisJoiners").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisJoiners\" class=\"chat-header-button\"><i class=\"icon icon-hybris-joiners\"></i></div>");
    }
    $(".icon-hybris-joiners").css("background", "url('https://cdn.plug.dj/_/static/images/icons.5f9a8e66-2aff-4176-96b8-7859f92becfc.png')");
    $(".icon-hybris-joiners").css("background-position", "-245px 0px");
    $("#hybrisJoiners").unbind('click.hybris');
    $("#hybrisJoiners").bind('click.hybris', switchAutoNoticeJoinersLeavers);
	$("#hybrisJoiners").unbind('mouseenter.hybris');
	$("#hybrisJoiners").bind('mouseenter.hybris', showAutoJoinersLeaversToolTip);
	$("#hybrisJoiners").unbind('mouseleave.hybris');
	$("#hybrisJoiners").bind('mouseleave.hybris', hideToolTip);
}
function makeUIModifications(){
	setupHybrisToolBar();
	setupAutoWootBtn();
	setupAutoNoticeBtn();
	setupAutoJoinersLeaversBtn();
}
function main(){
    makeUIModifications();
    stopAutoWoot();
    startAutoNotice();
    stopAutoNoticeJoinersLeavers();
}
$(document).ready(main);
