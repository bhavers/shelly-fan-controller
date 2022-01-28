/**
 * Script for Shelly plus 1 PM to control the bathroom fan.
 * It checks the humidity and turns the fan on/off. 
 */

let topic_humidity = "shellies/shelly-ht-bathroom/sensor/humidity";
let treshold_humidity = 70;

let swParams = {
      id: 0,
      on: false
    };

/**
 * This eventHandler is not needed.
 * It's just here to understand what events are generated.
 */
Shelly.addEventHandler(
    function (event, ud) {
      //print(JSON.stringify(event));
        if (typeof (event.info.event) !== 'undefined') {
          print("Event trigger: " + event.info.event);
        }
        if (typeof (event.info.source) !== 'undefined') {
          // Possibilities: WS_in (web gui), timer, button, loopback (vanuit script?)
          print("Event source: " + event.info.source);
          if (event.info.output === true) {
            print("Fan wordt aangezet");
          } else {
            print("Fan gaat uit");
          }
        }
    },
    null
);

/**
 * @param {string} topic 
 * @param {string} message 
 */
function MQTTCmdListener(topic, message) {
  print("Value: " + message + " (topic: " + topic + ")");
  if (topic === topic_humidity) { 
    if (JSON.parse(message) > treshold_humidity)
    {
      print("Turn fan on");
      swParams.on = true;
    } else {
      print ("Turn fan off");
      swParams.on = false;
    }
    Shelly.call("Switch.Set", swParams);
  }
}

function initMQTT() {
  if (MQTT.isConnected() === true) {
    MQTT.subscribe(topic_humidity, MQTTCmdListener);
    // Maybe monitor multiple topics.
    //MQTT.subscribe(topic_temperature, MQTTCmdListener);
  }
}

initMQTT();

