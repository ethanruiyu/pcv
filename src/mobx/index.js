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
}

export default new Mobx()