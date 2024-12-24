import { Glowing } from '../src'

document.querySelector('#app')!.innerHTML = `
    <textarea id="ai-textarea">Here is a textarea</textarea>

    <input type="range" id="width" min="1" max="100" value="8" />
    <input type="range" id="rotationDuration" min="500" max="6000" value="3000" />

    <button id="toggle-glow">Toggle Glow</button>
    <button id="remove-glow">Remove Glow</button>
`

const init = () => {
  // document load
  window.addEventListener('load', () => {
    const element = document.getElementById('ai-textarea')
    if (!element) return

    const glowing = new Glowing(element, { rotationDuration: 3000 })

    const widthInput = document.getElementById('width') as HTMLInputElement

    if (widthInput) {
      // on input change
      widthInput.addEventListener('input', () => {
        const width = parseInt(widthInput.value)
        glowing.setOptions({ width })
      })
    }

    const rotationDurationInput = document.getElementById('rotationDuration') as HTMLInputElement
    if (rotationDurationInput) {
      rotationDurationInput.addEventListener('input', () => {
        const rotationDuration = parseInt(rotationDurationInput.value)
        glowing.setOptions({ rotationDuration })
      })
    }

    if (!element) return

    document.getElementById('toggle-glow')!.addEventListener('click', () => {
      glowing.toggle()
    })

    document.getElementById('remove-glow')!.addEventListener('click', () => {
      glowing.remove()
    })
  })
}

init()
