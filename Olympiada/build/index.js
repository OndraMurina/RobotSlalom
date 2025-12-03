import { createRobutek } from "./libs/robutek.js";
import * as colors from "./libs/colors.js";
import { LED_WS2812B, SmartLed } from "smartled";
import * as gpio from "gpio";
const robutek = createRobutek("V2");
const thresh = 600; // Mez pod kterou se barva považuje za černou
const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B);
ledStrip.set(0, colors.white);
ledStrip.set(1, colors.white);
ledStrip.set(2, colors.white);
ledStrip.set(3, colors.white);
ledStrip.set(4, colors.white);
ledStrip.set(5, colors.white);
ledStrip.set(6, colors.white);
ledStrip.show();
let on = 0;
gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT);
gpio.on("falling", robutek.Pins.ButtonRight, () => {
    let on = 1;
});
gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT);
gpio.on("falling", robutek.Pins.ButtonLeft, () => {
    let on = 0;
});
while (on = 1) {
    const l = robutek.readSensor("LineFL");
    const r = robutek.readSensor("LineFR");
    if (l < thresh) {
        robutek.leftMotor.setSpeed(100);
        robutek.rightMotor.setSpeed(10);
    }
    else if (r < thresh) {
        robutek.leftMotor.setSpeed(10);
        robutek.rightMotor.setSpeed(100);
    }
    else {
        robutek.leftMotor.setSpeed(100);
        robutek.leftMotor.setSpeed(100);
    }
    await sleep(10);
    console.log(`l: ${l}, r: ${r}`);
}
// do příště si chci udělat tlačítko, co spusti a zastaví program
// komentare: minimum a maximum speed konstanta, hodnoty pojmenovany, 
// vypsat co se srobotem deje(vzpis senzoru) 
// sledovat rychlost kol pomoci wifi
/* zastaveni if
import * as gpio from "gpio";
gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT);

gpio.on("falling", robutek.Pins.ButtonRight, () => {
  robutek.stop()
});

zarovnani control shift F
zapoznamkovani ctrl K C
yastaven9 terminalu ctrl c
shift a tabulator nebo jen tabulator cely texty dolevanebo doprava
*/
//prohodit l a r v while true
