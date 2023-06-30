Controlling switches and wallplugs from TKB Home with Homey.

Code initially created by Remco Mengers, all credits to him for his fantastic work.
I've now taken over maintenance going forward.
As with the existing codebase, I don't have many of these devices.
Devices are added based on assumptions and full working of every device
is not guaranteed.

--- Current Supported devices: ---
TSM02, TSM10, TSP01, TZ04, TZ35, TZ36, TZ37, TZ55, TZ56, TZ57, TZ65, TZ66, TZ67, TZ67-PLUS, TZ68, TZ68-PLUS, TZ69, TZ74, TZ78, TZ88.

----- Device Specific Notes: -----
TZ35/TZ55/TZ65:
The Wall Dimmers need to be polled to get the correct dim state when you dim it with the switch itself.
The interval is by default on 300 seconds (5 minutes).
It is not recommended to put this below 60 seconds (1 minute), it might cause too much traffic.
You can also "immediately" update its state in homey, by just pressing any of the switches once.
The dim level takes about 2.5 seconds to update when switching on, since the dimmer ramps up slowly to its set brightness.

TZ67(-PLUS)/TZ68(-PLUS)/TZ69:
The wallplugs only use the polling interval if you use the button on the wallplug itself.
It is not recommended to put this below 60 seconds (1 minute), it might cause too much traffic.

TZ88:
It sends the wattage value when the load changes (more then) 5%.
This can't be edited and could cause of a lot of data if the load changes the power usage a lot.
All other manufacturers have this on at least 20% for this reason, so do keep this in mind.
The voltage and amperage don't get reported on intervals, added polling for this (by default poll is off to save traffic).
