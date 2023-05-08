import { SmartScreen } from './screen'

const scene = new Entity()
engine.addEntity(scene)

const build = new Entity()
build.addComponent(new GLTFShape('models/woltbuild.glb'))

build.setParent(scene)

const screen = new SmartScreen('screen', [
  {
    src: 'images/1.jpg',
    type: 'image',
    clickUrl: 'https://google.com'
  },
  {
    src: 'images/2.jpg',
    type: 'image'
  },
  {
    src: 'images/3.jpg',
    type: 'image'
  },
  {
    src: 'images/4.png',
    type: 'image'
  },
  {
    src: 'images/5.jpg',
    type: 'image'
  },
], {
  width: 8.26,
  ratio: '16:9',
  position: new Vector3(7.9, 4.8117, 15.91),
})

screen.setParent(scene)
