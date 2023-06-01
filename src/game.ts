import * as UI from '@dcl/ui-scene-utils'
import { ButtonStyles } from '@dcl/ui-scene-utils'
import { SmartScreen } from './screen'
import { createWearableVendor } from './wearableVendor'

const scene = new Entity()
scene.addComponent(new Transform({
  position: new Vector3(16,0,16),
  rotation: Quaternion.Euler(0,180,0)
}))
engine.addEntity(scene)

const build = new Entity()
build.addComponent(new GLTFShape('models/woltbuild.glb'))
build.setParent(scene)

const screen = new SmartScreen('screen', [
  {
    src: 'resources/wolt1.png',
    type: 'image',
    // clickUrl: 'https://google.com'
  },
  {
    src: 'resources/wolt2.jpg',
    type: 'image'
  },
  {
    src: 'resources/wolt3.png',
    type: 'image'
  }
], {
  width: 8.26,
  ratio: '16:9',
  position: new Vector3(7.9, 4.8117, 15.91)
})

screen.setParent(scene)

const wearableVendor = createWearableVendor(
  'models/woltwearable.glb',
  new Transform({ position: new Vector3(11, 0.3, 11.5) })
  // 'https://google.com'
)
wearableVendor.setParent(scene)

const stand = new Entity()
stand.addComponent(new GLTFShape('models/kioskwolt.glb'))
stand.addComponent(new Transform({
  position: new Vector3(14,0,4)
}))
stand.setParent(scene)

const promoCodePopUp = new UI.CustomPrompt(
  UI.PromptStyles.DARKLARGE,
  650,
  550
)
promoCodePopUp.addText('Regulamin', 0, 225, Color4.Red(), 50)
promoCodePopUp.addText('Kod promocyjny', 0, 175, Color4.White(), 25)
promoCodePopUp.addText('DECENTRALANDWOLT', 0, 125  , Color4.FromHexString('#00C2E8FF'), 25)
promoCodePopUp.addText(
  'daje 10 zl znizki na dowolne zamowienie\n ' +
  'z dostawa na Wolt\n' +
  '(wazny dla wszystkich uzytkownikow).\n ' +
  'Kod jest wazny do 30.06.2023,\n' +
  'a po wpisaniu kodu, srodki sa wazne\n' +
  'na koncie uzytkownika Wolt przez 7 dni.\n' +
  'Liczba kodow jest limitowana,\n' +
  'a limit wpisan kodu wynosi 500 pierwszych osob.',
  0,
  -125,
  Color4.White(),
  25
)
promoCodePopUp.addButton(
  'OK',
  0,
  -225,
  () => {
    promoCodePopUp.hide()
  },
  ButtonStyles.RED
)
promoCodePopUp.closeIcon.visible = false

