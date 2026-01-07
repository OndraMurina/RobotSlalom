import { I2C1 } from "i2c";
import { VL53L0X } from "./libs/VL53L0X.js";
import { createRobutek } from "./libs/robutek.js";
const robutek = createRobutek("V2");
; // ovládání motorů
import { LED_WS2812B, SmartLed } from "smartled";
const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B);
ledStrip.clear();
ledStrip.show();
I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
const info_o_vzdalenosti = new VL53L0X(I2C1);
async function main() {
    while (true) {
        robutek.setSpeed(100); // Nastav rychlost na 100 mm/s
        robutek.setRamp(1000); // Nastav zrychlení na 2000 mm/s^2
        await robutek.move(0); // Ujeď 100 mm == 10 cm
        await sleep(100);
    }
}
main().catch(console.error);
async function pokus() {
    while (true) {
        const m = await info_o_vzdalenosti.read(); // čtení hodnoty vzdálenosti
        console.log("Distance: " + m.distance + " mm  \tSignal: " + m.signalRate + "\tAmb: " + m.ambientRate + "\tSPAD: " + m.effectiveSpadRtnCount);
        if ((m.distance <= 440) && (m.distance > 20)) {
            robutek.stop(); // zastavení robota
        }
        await sleep(10);
    }
}
pokus().catch(console.error);
// prví úpravy posílam (samostatný kód jen pro senzor vzdálenosti)
