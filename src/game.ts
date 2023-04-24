const scene = new Entity()
engine.addEntity(scene)

const build = new Entity()
build.addComponent(new GLTFShape('models/woltbuild.glb'))

build.setParent(scene)
