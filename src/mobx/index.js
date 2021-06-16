import { makeAutoObservable } from "mobx"

class Mobx {
  constructor() {
    makeAutoObservable(this)
  }

  /**
   * Colorization
   */
  colorization = 0

  colorizationChange(value) {
    this.colorization = value
  }

  /**
   * Point Size
   */
  pointSize = 0

  pointSizeChange(value) {
    this.pointSize = value
  }

  /**
   * Density
   */

  density = 3

  densityChange(value) {
    this.density = value
  }

  /**
   * viewport
   */
  viewport = 0

  viewportChange(value) {
    this.viewport = value
  }

  file = null

  fileChange(value) {
    this.file = value
  }
}

export default new Mobx()