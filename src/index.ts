// Export styles
import './styles.css'

type GlowingOptions = {
  timeout?: number
  borderRadius?: number

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
  constructor(el: HTMLElement, options: GlowingOptions = {}) {
    this.add(el, options)
  }

  private cleanupListeners: (() => void) | null = null
  private glowContainer: HTMLDivElement | null = null

  private add(el: HTMLElement, options: GlowingOptions = {}) {
    // Clean up any existing element first
    if (this.cleanupListeners) {
      this.cleanupListeners()
      this.cleanupListeners = null
    }

    this.glowContainer = this.createGlowContainer()

    const styles = getComputedStyle(el)

    this.glowContainer.style.setProperty('opacity', '1')

    this.setOptions(options)

    let timeout: NodeJS.Timeout | null = null

    if (options.timeout) {
      timeout = setTimeout(() => {
        if (!this.glowContainer) return

        this.glowContainer.style.setProperty('opacity', '0')
      }, options.timeout)
    }

    const setElementPosition = () => {
      const rect = el.getBoundingClientRect()

      const borderRadius = parseFloat(styles.borderRadius) || 0

      // Set glowContainer rect
      this.glowContainer?.style.setProperty('top', `${rect.y}px`)
      this.glowContainer?.style.setProperty('left', `${rect.x}px`)
      this.glowContainer?.style.setProperty('width', `${rect.width}px`)
      this.glowContainer?.style.setProperty('height', `${rect.height}px`)
      this.glowContainer?.style.setProperty('border-radius', `${borderRadius}px`)
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
    if (!this.glowContainer) return

    if (options.rotationDuration) {
      this.glowContainer.style.setProperty('--rotationDuration', `${options.rotationDuration}ms`)
    }

    if (options.blendMode) {
      this.glowContainer.style.setProperty('--glowingBlendMode', options.blendMode)
    }

    if (options.width) {
      this.glowContainer.style.setProperty('--glowingWidth', `${options.width}px`)
    }

    if (options.colors) {
      this.glowContainer.style.setProperty('--glowingColors', options.colors.join(','))
    }

    if (options.colors2) {
      this.glowContainer.style.setProperty('--glowingColors2', options.colors2.join(','))
    }
  }

  public recalculatePosition: () => void = () => {}

  private createGlowContainer() {
    const glowWrapper = document.createElement('div')
    glowWrapper.classList.add('glowing-wrapper')

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
    if (!this.glowContainer) return

    this.glowContainer.style.setProperty(
      'opacity',
      this.glowContainer.style.getPropertyValue('opacity') === '1' ? '0' : '1',
    )
  }

  public show() {
    if (!this.glowContainer) return

    this.glowContainer.style.setProperty('opacity', '1')
  }

  public hide() {
    if (!this.glowContainer) return

    this.glowContainer.style.setProperty('opacity', '0')
  }

  public remove() {
    if (this.cleanupListeners) {
      this.cleanupListeners()
      this.cleanupListeners = null
    }

    if (!this.glowContainer) return

    this.glowContainer.style.setProperty('opacity', '0')

    // Wait for css transition to finish
    this.glowContainer.addEventListener('transitionend', () => this.glowContainer?.remove())
  }
}
