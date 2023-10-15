// The Shelly's humidity sensing makes no sense. A humidity of 70 is way to high. This
// seems to be a common issue. Anyway, i only need it to sense a certain amount of
// humidity, so its fine for the application.
// Still to do:
// - manually turning on the fan (push button) doesn't work. The code will disable the fan.
//   have to create a timer that when pushed manually, it stays on for x minutes, no matter what.
// - a protection for when the fan keeps turned on. It never happened so far. But maybe just reset
// it every night to off state and/or publish an event when the fan is on for >2 hours.
let treshold_humidity = 73; // was 78
let switch_manual_set = false;
let topic_humidity = "shellies/shellyht-badkamer/sensor/humidity";
let swParams = {
  id: 0,
  on: false,
};

Shelly.addEventHandler(function (e) {
  //print("Event triggered...");
  //print(e); // er worden 3 of 4 events getriggered als je de fan aanzet (o.a. state change en power changed)
  if (e.component === "input:0") {
    if (e.info.event === "single_push") {
      if (switch_manual_set === true) {
        switch_manual_set = false;
      } else {
        switch_manual_set = true;
        Timer.set(/* number of miliseconds 1000 = 1 sec, 600000 = 10 min */ 600000, /* repeat? */ false, /* callback */ timerCode);
      }
      print("Button was pushed");
    }
  }
});

function timerCode() {
  print("Timer expired, switching fan off");
  switch_manual_set = false;
  Shelly.call("Switch.Set", { id: 0, on: false });
}

/**
 * @param {string} topic
 * @param {string} message
 */
function MQTTCmdListener(topic, message) {
  if (topic === topic_humidity && message !== "") {
    print("Luchtvochtigheid (bij spiegel) is " + message + "% (treshold is " + treshold_humidity + ")");
    if (message > treshold_humidity) {
      print("Turn fan on");
      swParams.on = true;
    } else {
      if (switch_manual_set === false) {
        print("Turn fan off");
        swParams.on = false;
      } else {
        print("Humidity lower than target, but manual button press keeps it running)");
      }
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
