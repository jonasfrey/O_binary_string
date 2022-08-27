
var b_script_run_with_deno = "Deno" in window
// console.log("loaded")
if(b_script_run_with_deno){
    
    // var {createCanvas}  = await import("https://deno.land/x/canvas/mod.ts")
    var {Canvas}  = await import("https://deno.land/x/canvaseno/mod.ts")
    // import {Canvas} from 'https://deno.land/x/canvaseno/mod.ts'

    // import { createCanvas } from "https://deno.land/x/canvas/mod.ts";
    console.warn(`
    the module was imported in deno (https://deno.land/) which does not provide the document.createElement("canvas") by default, as a workaround 
    the module canvas (https://deno.land/x/canvas) is imported which comes with some limitaions, if you want the full functionality of O_binary_string 
    consider using it client side in a browser javascript engine
    `)
}
class O_image_data_multidimensional{
    constructor(
        o_image_data
    ){
  
        this.n_channels = o_image_data.data.length / (o_image_data.width * o_image_data.height)
        this.n_bits = o_image_data.data.BYTES_PER_ELEMENT * 8
        var n_max = (Math.pow(2, this.n_bits) -1)
 
        // we can use a js typed array and a view to 
        // fastly access the data
        // 
        // struct o_pixel {  //example if the pixel has 4 channels and uint8 values
        //     char n_red[1];
        //     char n_green[1];
        //     char n_blue[1];
        //     char n_alpha[1];
        //   };
        // const a_n_red = new Uint8Array(o_image_data.data, 0, 1);
        // const a_n_green = new Uint8Array(o_image_data.data, 1, 1);
        // const a_n_blue = new Uint8Array(o_image_data.data, 2, 1);
        // const a_n_alpha = new Uint8Array(o_image_data.data, 3, 1);
        // // now we can access the pixels like this 
        // var o_pixel = {
        //     n_red: a_n_red[n_pixel_index],
        //     n_a_n_green: a_a_n_green[n_pixel_index],
        //     n_a_n_blue: a_a_n_blue[n_pixel_index],
        //     n_a_n_alpha: a_a_n_alpha[n_pixel_index],
        // }

        var n_i = 0;

        this.a_n_normalized = [] 
        // (max255/uint8array) [20, 244, 255, 55] -> [ 0.0784..., 0.9568..., 1, 0.2156... ]
        
        this.a_a_pixel_n_normalized = [] 
        // [ [(r)0.0784..., (g)0.9568..., 1, (b)0.2156..., (a)0.2156..], [r,g,b,a], [r,g,b,a]... ]
        
        this.a_a_y_n_avg_normalized = [] 
        // [ [(y1) [(r)0.0784..., (g)0.9568..., 1, (b)0.2156..., (a)0.2156..], [r,g,b,a], [r,g,b,a]...],[(y2)[r,g,b,a], [r,g,b,a]...]... ]
        
        this.a_a_x_n_avg_normalized = [] 
        // [ [(x1) [(r)0.0784..., (g)0.9568..., 1, (b)0.2156..., (a)0.2156..], [r,g,b,a], [r,g,b,a]...],[(x2)[r,g,b,a], [r,g,b,a]...]... ]
        
        this.a_n_y_normalized = []

        var n_x = 0;
        var n_y = 0;
        var n_pixel = 0;

        while(n_i < o_image_data.data.length){
            var n_channel_index = 0
            var n_value_sum = 0
            while(n_channel_index < this.n_channels){
                n_value_sum+=o_image_data.data[n_i+n_channel_index]
                n_channel_index+=1
            }
            var n_avg = n_value_sum / n_channel_index
            var n_avg_normalized = n_avg / n_max

            this.a_n_y_normalized.push(n_avg_normalized)
            this.a_n_normalized.push(n_avg_normalized)
            n_y = parseInt(n_pixel / (o_image_data.width))
            n_x = n_pixel % (o_image_data.width); 

            if(n_x == (o_image_data.width-1)){
                this.a_a_y_n_avg_normalized.push(this.a_n_y_normalized)
                this.a_n_y_normalized = []
            }
            if(n_y == 0){
                this.a_a_x_n_avg_normalized.push([n_avg_normalized])
            }else{
                this.a_a_x_n_avg_normalized[n_x].push(n_avg_normalized)
            }

            n_i += this.n_channels;
            n_pixel += 1
        }
    }
}
class O_canvas_data{
    constructor(
        o_canvas,
        o_ctx
    ){
        // if a canvas has only content in the middle it can be 'cropped' to that content
        this.n_x_start_content = 0
        this.n_x_end_content = o_canvas.width -1
        this.n_y_start_content = 0
        this.n_y_end_content = o_canvas.height -1
        this.n_width_content = null //dynamic (end-start)
        this.n_heigt_content = null //dynamic (end-stat)

        var o_image_data = o_ctx.getImageData(
            0,
            0,
            o_canvas.width,
            o_canvas.height
        )

    
        this.o_image_data_multidimensional = new O_image_data_multidimensional(o_image_data)

        this.a_n_y_sum = this.o_image_data_multidimensional.a_a_y_n_avg_normalized.map(a=>a.reduce((a,b)=>a+b))
        this.a_n_x_sum = this.o_image_data_multidimensional.a_a_x_n_avg_normalized.map(a=>a.reduce((a,b)=>a+b))
        
        var a_s_axis = ['x', 'y']
        
        for(var n_index in a_s_axis){
            var s_axis = a_s_axis[n_index]
            var n_sum = this[`a_n_${s_axis}_sum`][this[`n_${s_axis}_start_content`]]
            while(n_sum == 0){
                this[`n_${s_axis}_start_content`]+=1
                n_sum = this[`a_n_${s_axis}_sum`][this[`n_${s_axis}_start_content`]]
            }
            var n_sum = this[`a_n_${s_axis}_sum`][this[`n_${s_axis}_end_content`]]
            while(n_sum == 0){
                this[`n_${s_axis}_end_content`]-=1
                n_sum = this[`a_n_${s_axis}_sum`][this[`n_${s_axis}_end_content`]]
            }
        }
        this.n_width_content = (this.n_x_end_content - this.n_x_start_content ) + 1
        this.n_height_content = (this.n_y_end_content - this.n_y_start_content ) + 1
        // console.log(this)

        this.o_image_data_cropped = o_ctx.getImageData(this.n_x_start_content, this.n_y_start_content, this.n_width_content, this.n_height_content)
        this.o_image_data_multidimensional_cropped = new O_image_data_multidimensional(this.o_image_data_cropped)

    }
}
var b_script_run_with_deno = "Deno" in window
class O_binary_string{
    constructor(
        s_string,
        n_font_size_px,
        ){
        this._s_string = String(s_string)
        this.s_default_system_font = 'sans' // could be Arial, sans, serif...
        this.a_bitmap = []
        this.a_a_bitmap = [[]]
        this.a_normalized = []
        this.a_a_normalized = [[]]
        this._n_font_size_px = n_font_size_px
        //when not using a custom loaded .ttf font, 
        //the letter may contain semitransparent pixels which would make it look smooth when 
        //looked at very small text, to use only certain pixels above a threshold we can adjust this value
        this._n_threshhold = 0.318

        this.f_update_all()

    }
    f_init_canvas(){
        //in the beginning we have to guess the width and height of the text rendered in a certain font
        var n_width_engough = this.n_font_size_px * 1.1 * this.s_string.length
        var n_height_enought = this.n_font_size_px * 1.1 * this.s_string.length
        if(b_script_run_with_deno){
            this.o_canvas = Canvas.createCanvas(
                parseInt(n_width_engough),
                parseInt(n_height_enought),
            );
            this.o_ctx = this.o_canvas.getContext("2d")    
        }else{
            this.o_canvas = document.createElement("canvas")
            this.o_canvas.width = n_width_engough
            this.o_canvas.height = n_height_enought
            // document.body.appendChild(this.o_canvas)
            this.o_ctx = this.o_canvas.getContext("2d")
        }
    }
    get n_threshhold(){
        return this._n_threshhold
    }
    set n_threshhold(variable){
        this._n_threshhold = variable
        this.f_update_all()
    }
    get n_font_size_px(){
        return this._n_font_size_px
    }
    set n_font_size_px(variable){
        this._n_font_size_px = variable
        this.f_update_all()
    }
    get s_string(){
        return this._s_string
    }
    set s_string(variable){
        this._s_string = String(variable)
        this.f_update_all()
    }
    f_update_all(){
        this.f_init_canvas()
        this.f_fill_text_and_update_bitmaps()

        // console.log("---")
        // console.log(this.s_binary_text)
        // console.log("---")
    
    }

    // f_set_pixelated_canvas(){
    //     // disable_antialas_enable_pixelating
    //     // disaable antialiasing / make pixelated
    //     self.o_ctx['imageSmoothingEnabled'] = false;       /* standard */
    //     self.o_ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
    //     self.o_ctx['oImageSmoothingEnabled'] = false;      /* Opera */
    //     self.o_ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
    //     self.o_ctx['msImageSmoothingEnabled'] = false;     /* IE */
    // }

    f_fill_text_and_update_bitmaps(){
        this.o_ctx.fillStyle = "red";
        this.o_ctx.font = `${this.n_font_size_px}px ${this.s_font_name}`;
        this.o_ctx.clearRect(0, 0, this.o_canvas.width, this.o_canvas.height);
        this.o_ctx.fillText(this.s_string, 0, this.n_font_size_px)
        this.o_canvas_data = new O_canvas_data(this.o_canvas, this.o_ctx)
        //crop canvas
        if(b_script_run_with_deno){
            this.o_canvas = Canvas.createCanvas(this.o_canvas_data.n_width_content, this.o_canvas_data.n_height_content);
            this.o_ctx = this.o_canvas.getContext("2d")
            this.o_ctx.fillStyle = "red"
            this.o_ctx.font = this.n_font_size_px+'px Arial';
        }else{
            this.o_canvas.width = this.o_canvas_data.n_width_content
            this.o_canvas.height = this.o_canvas_data.n_height_content
            this.o_ctx.fillStyle = "red";
            this.o_ctx.font = `${this.n_font_size_px}px ${this.s_font_name}`;
        }
        this.o_ctx.putImageData(this.o_canvas_data.o_image_data_cropped, 0, 0)

        if(b_script_run_with_deno){
            this.f_write_file()
        }
    
        this.s_binary_text = this.f_s_binary_text()
        
    }
    f_write_file(){
        const pwd = new URL('.', import.meta.url).pathname;

        var s_path_name_file_name_relative = import.meta.url.split('/').pop()+".png"
        console.log("file was written: "+ pwd + "/" + s_path_name_file_name_relative)
        Deno.writeFile(s_path_name_file_name_relative, this.o_canvas.toBuffer());
    }
    async f_load_font(
        s_font_name_or_path = "./fonts/visitor1.ttf"
    ){
        var self = this
        if(s_font_name_or_path.includes('.') && s_font_name_or_path.includes('/')){
            self.s_font_url = s_font_name_or_path
        }else{
            return new Promise(function(f_resolve){
                self.s_font_name = s_font_name_or_path
                f_resolve()
                self.f_update_all()

            })
        }
        return new Promise(function(f_resolve){
            if(b_script_run_with_deno){
                var err = new Error();
                console.log(err.stack);
                console.log('if you are trying to load a font via http')
                console.log("loading custom web fonts not yet supported with Deno")
                f_resolve()
            }
            var s_font_css_url = `url(${self.s_font_url})`
            var s_font_name = s_font_css_url.split('/').pop().split('.').slice(0, -1)
            self.s_font_name = s_font_name
            self.o_font = new FontFace(self.s_font_name, s_font_css_url);
            self.o_font
                .load()
                .then(
                    function (font) {
                        console.log(`Font loaded from ${self.s_font_url}`);
                        // with canvas, if self is ommited won't work
                        document.fonts.add(font);
                        f_resolve()
                        self.f_update_all()

                    }, 
                    function(error){
                        console.error(`font with url ${self.s_font_url} could not be loaded`)
                        console.error(error)
                    }
                );
        })

    }
    f_s_binary_text(
        s_char_0 = ' ', 
        s_char_1 = 'x'
    ){
        var n_y = 0;
        var s = ''
        var a_s_line = []
        while(n_y < this.o_canvas_data.o_image_data_multidimensional_cropped.a_a_y_n_avg_normalized.length){
            var s_y = this.o_canvas_data.o_image_data_multidimensional_cropped.a_a_y_n_avg_normalized[n_y].map(n=>(n > this.n_threshhold )?s_char_1: s_char_0).join('')
            a_s_line.push(s_y)
            // console.log(n_y)
            // console.log(s)
            n_y +=1
        }
        return a_s_line.join('\n')
    }
}
export {O_binary_string}