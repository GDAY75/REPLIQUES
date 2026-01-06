import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "output", "form", "container"]

  show() {
    const text = this.inputTarget.value.trim()
    if (!text) return

    this.outputTarget.textContent = text

    // Mode plein écran
    this.containerTarget.classList.add("fullscreen")
    this.formTarget.classList.add("hidden")
  }

  reset() {
    this.containerTarget.classList.remove("fullscreen")
    this.formTarget.classList.remove("hidden")
    this.outputTarget.textContent = ""
    this.inputTarget.focus()
  }

  connect() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.reset()
      if (e.key === "Enter" && document.activeElement === this.inputTarget) {
        this.show()
      }
    })
  }
}

