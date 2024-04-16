// import { c } from './Game.js';
// export class Sprite {
//     constructor({position, imageSrc, scale = 1, framesMax = 1, sprites, imageOffset = {x: 0, y: 0}}) {
//         this.position = position;
//         this.image = new Image(); // creates an html image in javascript property
//         this.image.src = imageSrc; // stores image in property of image
//         this.scale = scale;
//         this.framesMax = framesMax;
//         this.framesCurrent = 0;
//         this.framesElapsed = 0;
//         this.framesHold = 5;
//         this.imageOffset = imageOffset;
//         this.sprites = sprites;
//     }

//     // draw(c) {
//     //     c.drawImage(this.image, // image used
//     //         this.framesCurrent * (this.image.width / this.framesMax), //x coordinate where to start clipping
//     //         0, //y coordinate where to start clipping- this is 0 because you always start clipping on the bottom of the image
//     //         this.image.width / this.framesMax, //width of cropped image
//     //         this.image.height, //height of cropped image
//     //         this.position.x - this.imageOffset.x, //x position of image
//     //         this.position.y - this.imageOffset.y, //y position of image
//     //         (this.image.width / this.framesMax) * this.scale, //width of image
//     //         this.image.height * this.scale); //height of image
//     // }

//     animateFrames() {
//         this.framesElapsed++;
//         if (this.framesElapsed % this.framesHold === 0) { //slows down the animation
//             if (this.framesCurrent < this.framesMax - 1) {
//                 this.framesCurrent++;
//             } else {
//                 this.framesCurrent = 0;
//             }
//         }
//     }

//     // update(c) { // UPDATES FOR STATIC SPRITES
//     //     // this.draw(c);
//     //     this.animateFrames();
//     // }

//     switchSprite(sprite) {
//         switch (sprite) {
//             case 'idle_right':
//                 if (this.image !== this.sprites.idle_right.image) {
//                     this.image = this.sprites.idle_right.image;
//                     this.framesMax = this.sprites.idle_right.framesMax; // need to set frames back to what is needed after a switch
//                     this.framesCurrent = 0;
//                 }
//                 break;
//             case 'idle_left':
//                 if (this.image !== this.sprites.idle_left.image) {
//                     this.image = this.sprites.idle_left.image;
//                     this.framesMax = this.sprites.idle_left.framesMax;
//                     this.framesCurrent = 0;
//                 }
//                 break;
//             case 'run_left':
//                 if (this.image !== this.sprites.run_left.image) {
//                     this.image = this.sprites.run_left.image;
//                     this.framesMax = this.sprites.run_left.framesMax;
//                     this.framesCurrent = 0;
//                 }
//                 break;
//             case 'run_right':
//                 if (this.image !== this.sprites.run_right.image) {
//                     this.image = this.sprites.run_right.image;
//                     this.framesMax = this.sprites.run_right.framesMax;
//                     this.framesCurrent = 0;
//                 }
//                 break;
//         }
//     }
// }

// const player = new Sprite({//position is an object because it takes two parameters, and x and y value, now wrap twice because posotion is wrapped with velocity
//     imageSrc: './img/Player1/wind_idle_right.png',
//     framesMax: 8,
//     scale: 2.8,
//     imageOffset:  {
//         x: 355,
//         y: 260
//     },
//     sprites: {
//         idle_right: {
//             imageSrc: "C:\Users\jdpay\Sediment_Game\my-app\public\sprites\Dude_Monster_Idle_4.png",
//             framesMax: 4,
             
//         },
//         idle_left: {
//             imageSrc: "C:\Users\jdpay\Sediment_Game\my-app\public\sprites\Dude_Monster_Idle_4.png",
//             framesMax: 4,

//         },
//         run_left: {
//             imageSrc: "C:\Users\jdpay\Sediment_Game\my-app\public\sprites\Dude_Monster_Idle_4.png",
//             framesMax: 6
            
//         },
//         run_right: {
//             imageSrc: "C:\Users\jdpay\Sediment_Game\my-app\public\sprites\Dude_Monster_Idle_4.png",
//             framesMax: 6
            
//         }
//     }
    
// })