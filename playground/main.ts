import { Glowing } from '../src'

document.querySelector('#app')!.innerHTML = `
    <textarea id="ai-textarea">Here is a textarea</textarea>

    <ul>
      <li>
        <input type="range" id="width" min="1" max="100" value="8" />
        <label for="width">Width</label>
      </li>
      <li>
        <input type="range" id="rotationDuration" min="500" max="6000" value="3000" />
        <label for="rotationDuration">Rotation Duration</label>
      </li>
      <li>
        <input type="range" id="glowingBlurRatio" min="-5" max="10" value="1.5" step="0.1" />
        <label for="glowingBlurRatio">Glowing Blur Ratio</label>
      </li>
    </ul>

    <button id="toggle-glow">Toggle Glow</button>
    <button id="remove-glow">Remove Glow</button>
    <button id="add-body-glow">Add Body Glow</button>
`

const init = () => {
  // Document load
  window.addEventListener('load', () => {
    const element = document.getElementById('ai-textarea')
    if (!element) return

    const glowing = new Glowing(element, { rotationDuration: 3000 })

    const widthInput = document.getElementById('width') as HTMLInputElement

    if (widthInput) {
      // On input change
      widthInput.addEventListener('input', () => {
        const width = parseInt(widthInput.value)
        glowing.setOptions({ width })
      })
    }

    const rotationDurationInput = document.getElementById('rotationDuration') as HTMLInputElement
    if (rotationDurationInput) {
      // On input change
      rotationDurationInput.addEventListener('input', () => {
        const rotationDuration = parseInt(rotationDurationInput.value)
        glowing.setOptions({ rotationDuration })
      })
    }

    const glowingBlurRatioInput = document.getElementById('glowingBlurRatio') as HTMLInputElement
    if (glowingBlurRatioInput) {
      // On input change
      glowingBlurRatioInput.addEventListener('input', () => {
        const glowingBlurRatio = parseInt(glowingBlurRatioInput.value)
        glowing.setOptions({ glowingBlurRatio })
      })
    }

    if (!element) return

    // On toggle glow button click
    document.getElementById('toggle-glow')!.addEventListener('click', () => {
      glowing.toggle()
    })

    // On remove glow button click
    document.getElementById('remove-glow')!.addEventListener('click', () => {
      glowing.remove()
    })

    // On add body glow button click
    document.getElementById('add-body-glow')!.addEventListener('click', () => {
      glowing.set(document.body)
    })
  })
}

init()
