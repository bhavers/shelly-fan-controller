// The Shelly's humidity sensing makes no sense. A humidity of 70 is way to high. This
// seems to be a common issue. Anyway, i only need it to sense a certain amount of 
// humidity, so its fine for the application.
// Still to do:
// - manually turning on the fan (push button) doesn't work. The code will disable the fan.
//   have to create a timer that when pushed manually, it stays on for x minutes, no matter what.
// - a protection for when the fan keeps turned on. It never happened so far. But maybe just reset
// it every night to off state and/or publish an event when the fan is on for >2 hours.
let topic_humidity = "shellies/shellyht-badkamer/sensor/humidity";
//let topic_temperature = "shellies/shellyplug-s-gamepc/temperature";
let treshold_humidity = 70;
//let treshold_temperature = 21;
let swParams = {
      id: 0,
      on: false
    };

Shelly.addEventHandler(
    function (event, ud) {
      //print(JSON.stringify(event));
        if (typeof (event.info.event) !== 'undefined') {
          //print("Event trigger: " + event.info.event);
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
  //print("in initMQTT");
  if (MQTT.isConnected() === true) {
    //print("MQTT is verbonden");
    //MQTT.subscribe(topic_temperature, MQTTCmdListener);
    MQTT.subscribe(topic_humidity, MQTTCmdListener);
  }
}

initMQTT();

