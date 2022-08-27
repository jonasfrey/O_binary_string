console.log("loaded")
if(typeof Deno != 'undefined'){
    
    var {createCanvas}  = await import("https://deno.land/x/canvas/mod.ts")
    // import { createCanvas } from "https://deno.land/x/canvas/mod.ts";
    console.warn(`
    the module was imported in deno (https://deno.land/) which does not provide the document.createElement("canvas") by default, as a workaround 
    the module canvas (https://deno.land/x/canvas) is imported which comes with some limitaions, if you want the full functionality of O_binary_string 
    consider using it client side in a browser javascript engine
    `)
}
class O_binary_string{
    constructor(
        s_string,
        n_font_size_px,
        ){
        this.n_width_engough = n_font_size_px * 2 * s_string.length
        if(typeof Deno != "undefined"){
            this.o_canvas = createCanvas(this.n_width_engough,n_font_size_px);
        }else{
            this.o_canvas = document.createElement("canvas")
            this.o_canvas.width = this.n_width_engough
            this.o_canvas.height = n_font_size_px
            document.body.appendChild(this.o_canvas)
        }

        this.o_ctx = this.o_canvas.getContext("2d")
        this.a_bitmap = []
        this.a_a_bitmap = [[]]
        this.a_normalized = []
        this.a_a_normalized = [[]]
        this.n_font_size_px = n_font_size_px
        this._n_font_size_px = n_font_size_px
        this.s_string = s_string
        this._s_string = s_string
        //when not using a custom loaded .ttf font, 
        //the letter may contain semitransparent pixels which would make it look smooth when 
        //looked at very small text, to use only certain pixels above a threshold we can adjust this value
        this.n_threshhold = 0.35
        this._n_threshhold = 0.35

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
        this._s_string = variable.toString()
        this.f_update_all()
    }
    f_update_all(){
        this.f_measure_text_and_update_canvas()
        this.f_fill_text_and_update_bitmaps()
        console.log(this.s_binary_text)
    }
    f_prepare_canvas(){
        // disable_antialas_enable_pixelating
        // disaable antialiasing / make pixelated
        self.o_ctx['imageSmoothingEnabled'] = false;       /* standard */
        self.o_ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
        self.o_ctx['oImageSmoothingEnabled'] = false;      /* Opera */
        self.o_ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
        self.o_ctx['msImageSmoothingEnabled'] = false;     /* IE */
    }
    f_measure_text_and_update_canvas(){
        var self = this
        //we need to set the text color before and after the measureText call
        self.o_ctx.fillStyle = "red";
        self.o_ctx.font = `${self.n_font_size_px}px ${self.s_font_name}`;
        // self.o_ctx.textBaseline="top"; // not supported with deno createCanvas
        self.o_measured_text = self.o_ctx.measureText(self.s_string); 
        self.n_font_height = self.o_measured_text.fontBoundingBoxAscent + self.o_measured_text.fontBoundingBoxDescent;
        self.n_actual_height = self.o_measured_text.actualBoundingBoxAscent + self.o_measured_text.actualBoundingBoxDescent;
        self.o_canvas.width = self.o_measured_text.width
        self.o_canvas.height = self.n_font_size_px*2    
        // self.o_canvas.height = self.n_font_height
        self.o_ctx.fillStyle = "red";
        self.o_ctx.font = `${self.n_font_size_px}px ${self.s_font_name}`;
    }
    f_fill_text_and_update_bitmaps(){
        var self = this
        self.o_ctx.fillText(self.s_string, 0, self.n_actual_height)
        // console.log(
        //     0,
        //     self.o_measured_text.actualBoundingBoxDescent,
        //     self.o_measured_text.width,
        //     self.n_actual_height
        // )
        var o_image_data = self.o_ctx.getImageData(
            0,
            self.o_measured_text.actualBoundingBoxDescent,
            self.o_measured_text.width,
            self.n_actual_height
        )
        var n_channels = o_image_data.data.length / (o_image_data.width * o_image_data.height)
        // check if image data is empty
        // console.log(o_image_data.data.filter(o=> o!= 0))
        // console.log(o_image_data)
        var n_bits = o_image_data.data.BYTES_PER_ELEMENT * 8
        var n_i = 0;
        self.a_normalized = []
        self.a_a_normalized = []
        self.a_bitmap = []
        self.a_a_bitmap = []
        var n_x = 0;
        var n_y = 0;
        var n_pixel = 0;
        var a_y_normalized = []
        var a_y_bool = []
        var n_max = (Math.pow(2, n_bits) -1)
        while(n_i < o_image_data.data.length){
            var n_channel_index = 0
            var n_value_sum = 0
            while(n_channel_index < n_channels){
                n_value_sum+=o_image_data.data[n_i+n_channel_index]
                n_channel_index+=1
            }
            var b_bool = false
            var n_avg = n_value_sum / n_channel_index
            var n_avg_normalized = n_avg / n_max
            if(n_avg_normalized > self._n_threshhold){
                b_bool = true
            }
            a_y_normalized.push(n_avg_normalized)
            a_y_bool.push(b_bool)
            self.a_normalized.push(n_avg_normalized)
            self.a_bitmap.push(b_bool)
            n_x = n_pixel % o_image_data.width; 
            n_y = parseInt(n_pixel / o_image_data.height)   
            if(n_x == (o_image_data.width-1)){
                self.a_a_normalized.push(a_y_normalized)
                self.a_a_bitmap.push(a_y_bool)
                a_y_normalized = []
                a_y_bool = []
            }

            n_i += n_channels;
            n_pixel += 1
        }

        self.s_binary_text = self.f_s_binary_text()
    }
    async f_load_font(
        s_font_url = "./fonts/visitor1.ttf"
    ){
        var self = this
        self.s_font_url = s_font_url
        return new Promise(function(f_resolve){
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
        while(n_y < this.a_a_bitmap.length){
            var s_y = this.a_a_bitmap[n_y].map(n=>(n == true)?s_char_1: s_char_0).join('')
            s+= s_y+"\n"
            // console.log(n_y)
            // console.log(s)
            n_y +=1
        }
        return s
    }
}

export {O_binary_string}