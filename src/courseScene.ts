import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function openCourse(canvas: HTMLCanvasElement, onReady: () => void, onFailure: () => void) {
  const assetPath = import.meta.env.BASE_URL + 'assets/locator/'
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 200)
  const orbit = new OrbitControls(camera, canvas)
  orbit.enablePan = false
  orbit.maxPolarAngle = Math.PI * 0.48
  orbit.minPolarAngle = 0.12
  const sky = new THREE.HemisphereLight(0xffffff, 0x82966c, 2)
  const daylight = new THREE.DirectionalLight(0xfff1d9, 3.3)
  daylight.position.set(-4, 10, 5)
  daylight.castShadow = true
  daylight.shadow.mapSize.set(1024, 1024)
  Object.assign(daylight.shadow.camera, { left: -9, right: 9, bottom: -9, top: 9 })
  daylight.shadow.bias = -0.001
  scene.add(sky, daylight)

  let closed = false
  let frame = 0
  let radius = 1
  const center = new THREE.Vector3()
  const direction = new THREE.Vector3(1, 0.85, 1.2).normalize()
  const bounds = new THREE.Box3()
  const render = () => {
    if (frame || closed) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (!closed) renderer.render(scene, camera)
    })
  }
  const reset = () => {
    if (bounds.isEmpty()) return
    const halfAngle = THREE.MathUtils.degToRad(camera.fov / 2)
    const horizontal = Math.atan(Math.tan(halfAngle) * camera.aspect)
    const distance = 0.90 * radius / Math.sin(Math.min(halfAngle, horizontal))
    orbit.target.copy(center)
    camera.position.copy(center).addScaledVector(direction, distance)
    orbit.minDistance = radius * 0.7
    orbit.maxDistance = distance * 2
    orbit.update()
    render()
  }
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas
    if (!width || !height) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    reset()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  orbit.addEventListener('change', render)
  // Keep the page's scroll story available when the pointer is over the model.
  const allowPageScroll = (event: WheelEvent) => event.stopImmediatePropagation()
  canvas.addEventListener('wheel', allowPageScroll, { capture: true, passive: true })
  canvas.addEventListener('webglcontextlost', onFailure)
  const abort = new AbortController()

  function release(root: THREE.Object3D) {
    root.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return
      object.geometry.dispose()
      for (const material of [object.material].flat()) {
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) value.dispose()
        }
        material.dispose()
      }
    })
  }

  async function load() {
    const fetchAsset = async (name: string) => {
      const response = await fetch(assetPath + name, { signal: abort.signal })
      if (!response.ok) throw new Error('Course asset unavailable')
      return response
    }
    const [manifest, bytes] = await Promise.all([
      fetchAsset('model-manifest.json').then(response => response.json()),
      fetchAsset('model.glb').then(response => response.arrayBuffer()),
    ])
    const { scene: course } = await new GLTFLoader().parseAsync(bytes, assetPath)
    if (closed) { release(course); return }
    scene.add(course)
    course.traverse(object => { object.castShadow = true; object.receiveShadow = true })
    bounds.setFromObject(course)
    bounds.getCenter(center)
    radius = bounds.getBoundingSphere(new THREE.Sphere()).radius
    direction.fromArray(manifest.camera.position).sub(center).normalize()
    sky.color.set(manifest.background)
    resize()
    renderer.render(scene, camera)
    onReady()
  }
  load().catch(() => { if (!closed) onFailure() })

  return {
    reset,
    zoom(factor: number) {
      const offset = camera.position.clone().sub(orbit.target)
      offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, orbit.minDistance, orbit.maxDistance))
      camera.position.copy(orbit.target).add(offset)
      orbit.update()
      render()
    },
    rotate(angle: number) {
      camera.position.sub(orbit.target).applyAxisAngle(camera.up, angle).add(orbit.target)
      orbit.update()
      render()
    },
    dispose() {
      closed = true
      abort.abort()
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('wheel', allowPageScroll, true)
      canvas.removeEventListener('webglcontextlost', onFailure)
      orbit.dispose()
      release(scene)
      daylight.shadow.dispose()
      renderer.dispose()
    },
  }
}
