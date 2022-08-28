
import { O_binary_string } from "./O_binary_string.module.js";


const o_binary_string = new O_binary_string("O_binary_string", 10)
console.log(o_binary_string.s_binary_text)


// testing multiline string
o_binary_string.s_string = 
`
O_ bin 
   ary
s
t
r
i
n
g
`
console.log(o_binary_string.s_binary_text)

// const o_binary_string = new O_binary_string("Axy!`", 10)
// o_binary_string.n_threshhold = 0.318
// console.log(o_binary_string.s_binary_text)

// o_binary_string.n_threshhold = 0.0
// console.log(o_binary_string.s_binary_text)

// await o_binary_string.f_load_font('sans') // this should work
// console.log(o_binary_string.s_binary_text)
// await o_binary_string.f_load_font('serif') // this should work
// console.log(o_binary_string.s_binary_text)
// await o_binary_string.f_load_font('consolas') // this should work
// console.log(o_binary_string.s_binary_text)
// await o_binary_string.f_load_font('Verdana') // this should work
// console.log(o_binary_string.s_binary_text)


// window.o_binary_string = new O_binary_string("O_binary_string", 10)
// console.log(o_binary_string.s_binary_text)
// await o_binary_string.f_load_font()

// o_binary_string.s_string = "asdf"
// o_binary_string.n_threshhold = 0.1
// console.log(o_binary_string.s_binary_text)

// o_binary_string.s_string = "asdf"
// o_binary_string.n_threshhold = 0.33
// console.log(o_binary_string.s_binary_text)
