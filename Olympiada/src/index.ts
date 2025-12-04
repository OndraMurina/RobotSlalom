import { createRobutek } from "./libs/robutek.js"
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


console.log("Robot se zapnul")



 let on: Number = 0;


gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT);

gpio.on("falling", robutek.Pins.ButtonRight, () => {
   on = 1;
   console.log(on);
});


gpio.pinMode(robutek.Pins.ButtonLeft, gpio.PinMode.INPUT);

gpio.on("falling", robutek.Pins.ButtonLeft, () => {
   on = 0;
   console.log(on);
}); 



const setpoint = 512;
let speed = 789;
let k_p = 0.96;
let k_d = 4.86;

function move(steering: number, speed: number) {
    if(steering < 0) {
        robutek.leftMotor.setSpeed((1 + steering) * speed)
        robutek.rightMotor.setSpeed(speed)
    } else if(steering > 0) {
        robutek.rightMotor.setSpeed((1 - steering) * speed)
        robutek.leftMotor.setSpeed(speed)
    }
}

async function main() {
    let previous_error = 0;
    robutek.leftMotor.move()
    robutek.rightMotor.move()
    console.log("start")
    while(true) {
        const l = robutek.readSensor("LineFR");
        let error = setpoint - l;
        let normalized_error = error / 512;
        let speed_of_change = normalized_error - previous_error;
        move(normalized_error * k_p + speed_of_change * k_d, speed);
        previous_error = normalized_error;
        await sleep(1);
    }
}

main().catch(console.error);








// Robot sjizdi, nenajede na caru
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
// zmena test 


//zmena 4.12.2025:
//pridal(zkopiroval) jsem kod z robotarny, nic jsem neupravoval, predeslej kod je dole. 
//





// zapinani a vypinani pomoci tlacitka
// robutek.leftMotor.move();
// robutek.rightMotor.move();  


// //ovlada levo a v pravo, kam pojede
// let slowS: number = 25;
// let middleS: number = 100
// let fastS: number = 200

// async function main (){

//   while(true) {

//     if(on == 1) {
//         const l = robutek.readSensor("LineFL");
//         const r = robutek.readSensor("LineFR");
//         if(l < thresh) {
//             robutek.leftMotor.setSpeed(fastS);
//             robutek.rightMotor.setSpeed(slowS);
//         } else if(r < thresh) {
//             robutek.leftMotor.setSpeed(slowS);
//             robutek.rightMotor.setSpeed(fastS);
//         } else {
//             robutek.leftMotor.setSpeed(fastS);
//             robutek.leftMotor.setSpeed(fastS);
//         }
//         await sleep(10);
//         console.log(`l: ${l}, r: ${r}`);
//     }
//     else {
//         robutek.leftMotor.setSpeed(0);
//         robutek.rightMotor.setSpeed(0);  

//     }
//     await sleep(10);
//   }
// }

// main().catch(console.error); 

