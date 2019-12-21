import Point from './atoms/Point'
import Rectangle from './atoms/Rectangle'
import MouseFascade from './components/MouseFascade'
import ElementsFascade from './components/ElementsFascade'
import Layer from './components/Layer'
import GridLayer from './modules/GridLayer'
import ElementsLayer from './modules/ElementsLayer'
import OverlayLayer from './modules/OverlayLayer'
import Loop from './modules/Loop'
import SelectionEntity from './modules/SelectionEntity'
import RectangleEntity from './modules/RectangleEntity'

console.log(new Point())
console.log(new Rectangle())
console.log(new MouseFascade())
console.log(new ElementsFascade())
console.log(new Layer(document.getElementById('canvas_layer_0')))
console.log(new ElementsLayer(document.getElementById('canvas_layer_1')))
console.log(new OverlayLayer(document.getElementById('canvas_layer_2')))
console.log(new GridLayer(document.getElementById('canvas_layer_0')))
console.log(SelectionEntity)
console.log(RectangleEntity)

console.log('nothing to do')


