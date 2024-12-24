// Export styles
import './styles.css'

type GlowingOptions = {
  timeout?: number
  borderRadius?: number
  label?: string

  /**
   * @default 2s
   * @description The duration of the glow rotation animation in milliseconds. Alternatively, you can set the `--rotationDuration` CSS variable.
   */
  rotationDuration?: number

  /**
   * @default color-dodge
   * @description The blend mode of the glow. Alternatively, you can set the `--glowingBlendMode` CSS variable.
   */
  blendMode?: 'color-dodge' | 'screen' | 'lighten' | 'color'

  /**
   * @default 4px
   * @description The width of the glow in pixels. Alternatively, you can set the `--glowingWidth` CSS variable.
   */
  width?: number

  /**
   * @default cyan, black, purple, black, tomato, black, purple, cyan
   * @description The number of colors to use in the first gradient.
   */
  colors?: string[]

  /**
   * @default white, black, black, white, black, black, white
   * @description The number of colors to use in the second gradient.
   */
  colors2?: string[]
}

export class Glowing {
  private cleanupListeners: (() => void) | null = null
  private glowWrapper: HTMLDivElement | null = null
  private options: GlowingOptions = {}

  constructor(el: HTMLElement, options: GlowingOptions = {}) {
    this.options = options
    this.set(el, this.options)
  }

  public async set(el: HTMLElement, options: GlowingOptions = {}) {
    // Clean up any existing element first
    await this.remove()

    this.glowWrapper = this.createGlowContainer()

    this.setOptions({ ...this.options, ...options })

    setTimeout(() => {
      if (!this.glowWrapper) return
      this.glowWrapper.style.setProperty('opacity', '1')
    }, 100)

    let timeout: NodeJS.Timeout | null = null

    if (options.timeout) {
      timeout = setTimeout(() => {
        if (!this.glowWrapper) return

        this.glowWrapper.style.setProperty('opacity', '0')
      }, options.timeout)
    }

    const styles = getComputedStyle(el)

    const setElementPosition = () => {
      const rect = el.getBoundingClientRect()

      const borderRadius = parseFloat(styles.borderRadius) || 0

      // Set glowContainer rect
      this.glowWrapper?.style.setProperty('top', `${rect.y}px`)
      this.glowWrapper?.style.setProperty('left', `${rect.x}px`)
      this.glowWrapper?.style.setProperty('width', `${rect.width}px`)
      this.glowWrapper?.style.setProperty('height', `${rect.height}px`)
      this.glowWrapper?.style.setProperty('border-radius', `${borderRadius}px`)
    }

    this.recalculatePosition = setElementPosition

    // Create a ResizeObserver to watch for element size changes
    const resizeObserver = new ResizeObserver(this.recalculatePosition.bind(this))
    resizeObserver.observe(el)

    window.addEventListener('load', this.recalculatePosition.bind(this))
    window.addEventListener('resize', this.recalculatePosition.bind(this))
    window.addEventListener('scroll', this.recalculatePosition.bind(this))

    this.cleanupListeners = () => {
      resizeObserver.disconnect()
      window.removeEventListener('load', this.recalculatePosition.bind(this))
      window.removeEventListener('resize', this.recalculatePosition.bind(this))
      window.removeEventListener('scroll', this.recalculatePosition.bind(this))

      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    }

    return this.cleanupListeners
  }

  public setOptions(options: GlowingOptions) {
    if (!this.glowWrapper) return

    if (options.rotationDuration) {
      this.glowWrapper.style.setProperty('--rotationDuration', `${options.rotationDuration}ms`)
      this.options.rotationDuration = options.rotationDuration
    }

    if (options.blendMode) {
      this.glowWrapper.style.setProperty('--glowingBlendMode', options.blendMode)
      this.options.blendMode = options.blendMode
    }

    if (options.width) {
      this.glowWrapper.style.setProperty('--glowingWidth', `${options.width}px`)
      this.options.width = options.width
    }

    if (options.colors) {
      this.glowWrapper.style.setProperty('--glowingColors', options.colors.join(','))
      this.options.colors = options.colors
    }

    if (options.colors2) {
      this.glowWrapper.style.setProperty('--glowingColors2', options.colors2.join(','))
      this.options.colors2 = options.colors2
    }

    if (options.label) {
      this.glowWrapper.setAttribute('data-glowing-label', options.label)
      this.options.label = options.label
    }
  }

  public recalculatePosition: () => void = () => {}

  private createGlowContainer() {
    const glowWrapper = document.createElement('div')
    glowWrapper.classList.add('glowing-wrapper')
    glowWrapper.style.setProperty('opacity', '0')

    // Glow container 1
    const glowingContainer1 = document.createElement('div')
    glowingContainer1.classList.add('glowing-container')

    const glowingBorder = document.createElement('div')
    glowingBorder.classList.add('glowing-container--border')
    glowingContainer1.appendChild(glowingBorder)

    // Glow container 2
    const glowingContainer2 = document.createElement('div')
    glowingContainer2.classList.add('glowing-container', 'glowing-container-2')

    const glowingBorder2 = document.createElement('div')
    glowingBorder2.classList.add('glowing-container--border', 'glowing-container--border2')
    glowingContainer2.appendChild(glowingBorder2)

    glowWrapper.appendChild(glowingContainer1)
    glowWrapper.appendChild(glowingContainer2)

    document.body.appendChild(glowWrapper)

    return glowWrapper
  }

  public toggle() {
    if (!this.glowWrapper) return

    this.glowWrapper.style.setProperty(
      'opacity',
      this.glowWrapper.style.getPropertyValue('opacity') === '1' ? '0' : '1',
    )
  }

  public show() {
    if (!this.glowWrapper) return

    this.glowWrapper.style.setProperty('opacity', '1')
  }

  public hide() {
    if (!this.glowWrapper) return

    this.glowWrapper.style.setProperty('opacity', '0')
  }

  public remove() {
    if (this.cleanupListeners) {
      this.cleanupListeners()
      this.cleanupListeners = null
    }

    return new Promise(resolve => {
      if (!this.glowWrapper) return resolve(false)

      this.glowWrapper.style.setProperty('opacity', '0')

      // Wait for css transition to finish
      this.glowWrapper.addEventListener('transitionend', () => {
        this.glowWrapper?.remove()
        resolve(true)
      })
    })
  }
}
