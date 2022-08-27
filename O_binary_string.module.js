if(typeof Deno != 'undefined'){
                    
    var {createCanvas}  = await import("https://deno.land/x/canvas/mod.ts")
    // import { createCanvas } from "https://deno.land/x/canvas/mod.ts";
    var o_canvas = createCanvas(100,100);
    console.warn(`
    the module was imported in deno (https://deno.land/) which does not provide the document.createElement("canvas") by default, as a workaround 
    the module canvas (https://deno.land/x/canvas) is imported which comes with some limitaions, if you want the full functionality of O_binary_string 
    consider using it client side in a browser javascript engine
    `)
}else{
    var o_canvas = document.createElement("canvas")
}
class O_binary_string{
    constructor(s_string){
        this.s_string = s_string
        this.o_canvas = o_canvas
    }
}
window.o_bin = new O_binary_string