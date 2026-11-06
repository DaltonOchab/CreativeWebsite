import { useEffect, useRef, useState } from 'react'
import type { openCourse } from './courseScene'
import './courseModel.css'

export default function CourseModel() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const controls = useRef<ReturnType<typeof openCourse> | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'preview'>('loading')

  useEffect(() => {
    let active = true
    const fallback = () => {
      if (active) setStatus('preview')
    }
    import('./courseScene').then(({ openCourse }) => {
      if (active && canvas.current) {
        controls.current = openCourse(canvas.current, () => setStatus('ready'), fallback)
      }
    }).catch(fallback)
    return () => {
      active = false
      controls.current?.dispose()
      controls.current = null
    }
  }, [])

  return <figure className="course-model" aria-label="Golf ball locator concept on the course">
    <div className="course-stage">
      {status !== 'ready' && <img className="course-preview" src={import.meta.env.BASE_URL + 'assets/locator/preview.png'} alt="Confirmed model showing the locator ball, ping rings and companion phone on a miniature course" />}
      <canvas ref={canvas} className={status === 'ready' ? 'course-ready' : ''} role="img"
        aria-label="Interactive golf course. Use left and right arrow keys to rotate." tabIndex={status === 'ready' ? 0 : -1}
        onKeyDown={event => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            controls.current?.rotate(event.key === 'ArrowLeft' ? -0.2 : 0.2)
          }
        }} />
    </div>
    <figcaption><span role="status">{status === 'ready' ? 'Drag to rotate' : status === 'loading' ? 'Loading 3D view…' : 'Static course preview'}</span>
      {status === 'ready' && <div className="course-controls" aria-label="Course view controls" role="group">
        <button aria-label="Zoom out" onClick={() => controls.current?.zoom(1.2)}>−</button>
        <button aria-label="Zoom in" onClick={() => controls.current?.zoom(1 / 1.2)}>+</button>
        <button onClick={() => controls.current?.reset()}>Reset view</button>
      </div>}
    </figcaption>
  </figure>
}
