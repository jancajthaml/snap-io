import Point from './atoms/Point'
import Rectangle from './atoms/Rectangle'
import MouseFascade from './components/MouseFascade'
import ElementsFascade from './components/ElementsFascade'
import Layer from './components/Layer'

console.log(new Point())
console.log(new Rectangle())
console.log(new MouseFascade())
console.log(new ElementsFascade())
console.log(new Layer(document.getElementById('canvas_layer_0')))

console.log('nothing to do')


