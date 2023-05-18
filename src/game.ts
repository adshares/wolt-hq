import { SmartScreen } from './screen'
import { createWearableVendor } from './wearableVendor'

const scene = new Entity()
engine.addEntity(scene)

const build = new Entity()
build.addComponent(new GLTFShape('models/woltbuild.glb'))

build.setParent(scene)

const screen = new SmartScreen('screen', [
  {
    src: 'images/wolt1.png',
    type: 'image',
    clickUrl: 'https://google.com'
  },
  {
    src: 'images/wolt2.jpg',
    type: 'image'
  },
  {
    src: 'images/wolt3.png',
    type: 'image'
  },
], {
  width: 8.26,
  ratio: '16:9',
  position: new Vector3(7.9, 4.8117, 15.91)
})

screen.setParent(scene)

const wearableVendor = createWearableVendor(
  'models/woltwearable.glb',
  new Transform({ position: new Vector3(8, 0.3, 13) }),
  // 'https://google.com'
)
wearableVendor.setParent(scene)

