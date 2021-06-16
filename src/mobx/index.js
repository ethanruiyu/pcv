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
  pointSize = 0.5

  pointSizeChange(value) {
    this.pointSize = value
  }

  /**
   * Density
   */

  density = 30

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

  exampleFile = 'bunny.obj'

  exampleFileChange(value) {
    this.exampleFile = value
  }
}

export default new Mobx()