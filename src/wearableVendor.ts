import { getUserData } from '@decentraland/Identity'
import * as ui from '@dcl/ui-scene-utils'
import { signedFetch } from '@decentraland/SignedFetch'
import { ApiService } from './apiService'

const apiService = new ApiService()

class WearableRotation implements ISystem {
  _entities: Entity[] = []

  update () {
    this._entities.forEach(e => {
      let transform = e.getComponent(Transform)
      transform.rotate(Vector3.Up(), 2)
    })
  }

  setWearables (entities: Entity[]) {
    this._entities = [...this._entities, ...entities]
  }
}

const rotationSystem = new WearableRotation()
engine.addSystem(rotationSystem)

export function createWearableVendor (model: string, transform: Transform, clickLink?: string) {
  let isModalActive = false
  const wearable = new Entity()
  const pivot = new Entity()
  const collider = new Entity()

  collider.addComponent(new BoxShape())
  collider.addComponent(new Transform({
    position: new Vector3(0, 1.25, 0),
    scale: new Vector3(0.3, 0.3, 0.3)
  }))

  pivot.addComponent(new Transform(transform))

  wearable.addComponent(new GLTFShape(model))
  wearable.addComponent(new Transform({
    position: new Vector3(0, 0, 0.28)
  }))

  rotationSystem.setWearables([pivot])

  const onWearableClick = new OnPointerDown(async () => {
    if (isModalActive) {
      return
    }
    isModalActive = true

    const userData = await getUserData()
    if (userData?.hasConnectedWeb3) {
      const response = await apiService.claimWearable({
        claim: 'backpack',
        userData: { userAccount: userData.userId, userName: userData.displayName }
      })
      if (response?.wasClaimed) {
        new ui.OkPrompt(
          'You will get wearable soon to you backpack',
          () => {
            log(`accepted`)
          },
          'Ok',
          true
        )
      } else {
        new ui.OkPrompt(
          'Success! Check you backpack soon',
          () => {
            log(`accepted`)
          },
          'Ok',
          true
        )
      }
    } else {
      new ui.OkPrompt(
        'You need MetaMask to claim this wearable',
        () => {
          log(`accepted`)
        },
        'Ok',
        true
      )
    }

    const confirmationModal = new ui.OkPrompt(
      'This is an Ok Prompt',
      () => {
        log(`accepted`)
        isModalActive = false
      },
      'Ok',
      true
    )
    confirmationModal.closeIcon.onClick = new OnClick(() => {
      log('close click')
      isModalActive = false
      confirmationModal.close()
    })
  }, { distance: 7, showFeedback: true })

  collider.addComponent(onWearableClick)

  wearable.setParent(pivot)
  collider.setParent(pivot)
  return pivot
}

