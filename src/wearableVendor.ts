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

    const confirmationModal = new ui.OkPrompt(
        'Processing...',
      () => {
        isModalActive = false
      },
      'Ok',
      true
    )
    confirmationModal.closeIcon.onClick = new OnClick(() => {
      isModalActive = false
      confirmationModal.close()
    })

    const userData = await getUserData()
    log(userData)
    if (userData?.hasConnectedWeb3) {
      const isWasClaimed = await apiService.checkIsWearableClaimed({
        claim: 'backpack',
        userData: { userAccount: userData.userId, userName: userData.displayName }
      })

      if (isWasClaimed.error) {
        confirmationModal.text.value = isWasClaimed.error
        return
      }


      if (!isWasClaimed.claimed) {
        const response = await apiService.claimWearable({
          claim: 'backpack',
          userData: { userAccount: userData.userId, userName: userData.displayName }
        })
        if (response.error) {
          confirmationModal.text.value = response.error
          return
        } else {
          confirmationModal.text.value = 'Success! Check you backpack soon'
        }
      } else {
        confirmationModal.text.value = 'You will get wearable to you backpack soon'
      }

    } else {
      confirmationModal.text.value = 'You need MetaMask to claim this wearable'
    }
  }, { distance: 7, showFeedback: true })

  collider.addComponent(onWearableClick)

  wearable.setParent(pivot)
  collider.setParent(pivot)
  return pivot
}

