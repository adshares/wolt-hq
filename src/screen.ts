export enum Ratio {
  '9:16' = 0.5625,
  '3:4' = 0.75,
  '1:1' = 1,
  '4:3' = 1.3333333333333333,
  '16:9' = 1.7777777777777777,
}

export declare type TAsset = {
  src: string,
  type: 'image' | 'video',
  clickUrl?: string,
}
export declare type TRatio = '9:16' | '3:4' | '1:1' | '4:3' | '16:9'
export declare type TStaticAsset = {
  asset: TAsset,
  width?: number,
  ratio?: TRatio,
  position?: Vector3,
  rotation?: Quaternion
}

export declare type TSmartScreen = {
  width?: number,
  ratio?: TRatio,
  position?: Vector3,
  rotation?: Quaternion
}

export class StaticAsset extends Entity {
  private readonly _width: number
  private readonly _ratio: TRatio

  constructor (name: string, params: TStaticAsset) {
    super(name)
    this._width = params.width || 1
    this._ratio = params.ratio || '1:1'
    this.addComponent(new Transform({
      scale: new Vector3(this._width, (this._width / Ratio[this._ratio]), 1),
    }))
    this.addComponent(new PlaneShape())
    this.renderAsset(params.asset)
  }

  public renderAsset (asset: TAsset): void {
    let material = new Material()
    let texture: Texture | VideoTexture | undefined = undefined

    this.getComponent(Transform).rotate(new Vector3(0, 1, 0), 180)
    if (asset.type === 'image') {
      this.getComponent(Transform).rotate(new Vector3(1, 0, 0), 180)
      texture = new Texture(asset.src)
      material.albedoTexture = texture
    } else if (asset.type === 'video') {
      const video = new VideoClip(asset.src)
      texture = new VideoTexture(video)
      texture.loop = true
      texture.volume = 0
      material.albedoTexture = texture
      texture.play()
    }

    this.addComponent(material)
  }
}

export class SmartScreen extends Entity {
  private readonly _width: number
  private readonly _ratio: TRatio
  private readonly _staticAssets: StaticAsset[]
  private _assets: TAsset[]
  private _currentAssetIndex: number = 0
  private _eButton: Entity
  private _fButton: Entity

  constructor (name: string, assets: TAsset[], params: TSmartScreen) {
    super(name)
    this.addComponent(new Transform({
      position: params?.position,
      rotation: params?.rotation
    }))
    this._width = params.width || 1
    this._ratio = params.ratio || '1:1'
    this._assets = assets
    this._staticAssets = assets.map((element, index) => {
      return new StaticAsset(`${name}_${index}`, {
        asset: element,
        width: params.width,
        ratio: params.ratio,
      })
    })
    this._staticAssets.forEach(element => element.addComponent(new OnPointerDown((e) => {
      if (e.buttonId === 0) this.onMainClick()
      if (e.buttonId === 1) this.onPrevClick()
      if (e.buttonId === 2) this.onNextClick()
    }, {distance: 13})))
    this.render()

    this._eButton = new Entity()
    this._eButton.addComponent(new GLTFShape('models/E_F.glb'))
    this._eButton.addComponent(new Transform({
      position: new Vector3(-4.25,0,0)
    }))
    this._eButton.addComponent(new OnPointerDown(() => this.onPrevClick(), {hoverText: 'Prev', button: ActionButton.POINTER, distance: 13}))
    this._eButton.setParent(this)

    this._fButton = new Entity()
    this._fButton.addComponent(new GLTFShape('models/E_F.glb'))
    this._fButton.addComponent(new Transform({
      position: new Vector3(4.25,0,0),
      rotation: Quaternion.Euler(0,180,0)
    }))
    this._fButton.addComponent(new OnPointerDown(() => this.onNextClick(), {hoverText: 'Next', button: ActionButton.POINTER, distance: 13}))
    this._fButton.setParent(this)
  }

  public render () {
    if (this._staticAssets[this._currentAssetIndex]) {
      engine.addEntity(this._staticAssets[this._currentAssetIndex])
      this._staticAssets[this._currentAssetIndex].setParent(this)
    }
  }

  public remove () {
    const entity = this._staticAssets[this._currentAssetIndex]
    if (entity.isAddedToEngine()) engine.removeEntity(entity)
  }

  public onPrevClick () {
    this.remove()
    this._currentAssetIndex -= 1
    if (this._currentAssetIndex < 0) this._currentAssetIndex = this._staticAssets.length - 1
    this.render()
  }

  public onNextClick () {
    this.remove()
    this._currentAssetIndex += 1
    if (this._currentAssetIndex > this._staticAssets.length - 1) this._currentAssetIndex = 0
    this.render()
  }

  public onMainClick () {
    if(this._assets[this._currentAssetIndex].clickUrl ){
      // @ts-ignore
      openExternalURL(this._assets[this._currentAssetIndex].clickUrl)
    }
  }
}


