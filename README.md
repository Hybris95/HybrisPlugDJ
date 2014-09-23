Hybris PlugDJ Scripts
=====================
Copyright
---------
Copyright © Hybris95

Contact : hybris_95@hotmail.com

How to use
----------
Copy/paste the script into the Console of your WebBrowser

(while Plug.dj window is on focus and channel is already joined)

Or for firefox users make a new bookmark with the following code :

javascript:(function(){$.getScript('https://raw.githubusercontent.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.js');}());

Or for chrome users make a new bookmark with the following code :

javascript:(function(){$.getScript('https://rawgit.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.js');}());

Firefox issues
--------------
Firefox blocks mixed-content by default.

To enable it, type "about:config" in Firefox's address bar.

Then search for "security.mixed_content.block_active_content".

And set it to false (by double clicking on it).

Warning
-------
Use autoAnswer and autoRaffle at your own risks, these issues should be fixed soon by Matthew and were developped for tests purposes.

TODO
----
Create a tag in the webpage for the audio instead of using mixed_content in javascript.
