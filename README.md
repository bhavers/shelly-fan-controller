# shelly-fan-controller
This project controls the bathroom fan based on humidity.
 
The main file is: fan-controller.mjs. This script runs on the Shelly plus 1PM. 
It takes input from a Shelly H&T that measures the humidity in the bathroom. The H&T sends it valua periodically over MQTT. Currently a MQTT broker is in between. Looks like the H&T could also trigger a webhook on the Plus 1PM directly (eliminating the need for the MQTT broker).
 
The Shelly Plus 1PM is configured as a momentary switch that keeps running for 30 minutes once pressed.
 
Example code for gen2 Shelly devices [shelly-script-examples](https://github.com/ALLTERCO/shelly-script-examples).
