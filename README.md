Hybris PlugDJ Scripts
=====================
Licensing
---------
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

Features
--------
* AutoWoot (Toggle Button)
* AutoJoin (Toggle Button) on all rooms but specific rooms<br />
  (room moderators have to ask me to be disallowed)
* Chat sound (Toggle Button) - Green = On mention, Blue = For every message
* Joiners/Leavers notification (Toggle Button) - Green = Everyone, Blue = Moderators Only
* AutoHide the User Interface (Toggle Button)
* WaitList changes notification (Toggle Button)
* AutoSongStat (Toggle Button) this tells you your stats (grabs/mehs) after you played
* Get the Estimated Time Awaited (from current position or globally if not joined)
* Get the names of people who Mehed the current song
* Get the names of people who Grabbed the current song

How to use
----------
* Copy/paste the script into the Console of your WebBrowser

(while Plug.dj window is on focus and channel is already joined)

* Make a new bookmark with the following code :

javascript:(function(){$.getScript('https://rawgit.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.js');}());

* Load the following UserScript into [GreaseMonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [Tampermonkey (Chrome)](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo/):

https://rawgit.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.user.js

Contact
-------
By mail : hybris_95@hotmail.com

On PlugDJ : Hybris95

Firefox issues
--------------
Firefox blocks mixed-content by default.

To enable it, type "about:config" in Firefox's address bar.

Then search for "security.mixed_content.block_active_content".

And set it to false (by double clicking on it).

TODO
----
Create a tag in the webpage for the audio instead of using mixed_content in javascript.
