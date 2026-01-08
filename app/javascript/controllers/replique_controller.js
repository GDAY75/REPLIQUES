import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "output", "form", "container", "button", "wait"]
  static values = { delay: Number }

  connect() {
    this._timer = null

    this._onKeydown = (e) => {
      if (e.key === "Escape") this.reset()
      if (e.key === "Enter" && document.activeElement === this.inputTarget) this.show()
    }
    document.addEventListener("keydown", this._onKeydown)
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKeydown)
    if (this._timer) clearTimeout(this._timer)
  }

  show() {
    const text = this.inputTarget.value.trim()
    if (!text) return
    if (this.containerTarget.classList.contains("is-waiting")) return

    // Prépare le plein écran + ralentissement
    this.outputTarget.textContent = ""
    this.containerTarget.classList.add("fullscreen", "is-waiting")
    this.formTarget.classList.add("hidden")
    this.buttonTarget.disabled = true
    this.waitTarget.classList.add("visible")

    // Délai volontaire avant “révélation”
    const delay = Number.isFinite(this.delayValue) ? this.delayValue : 1200
    this._timer = setTimeout(() => {
      this.waitTarget.classList.remove("visible")
      this.outputTarget.textContent = text

      // Déclenche l’animation d’apparition lente
      this.containerTarget.classList.remove("is-waiting")
      this.containerTarget.classList.add("reveal")
    }, delay)
  }

  reset() {
    if (this._timer) clearTimeout(this._timer)
    this._timer = null

    this.containerTarget.classList.remove("fullscreen", "is-waiting", "reveal")
    this.formTarget.classList.remove("hidden")
    this.waitTarget.classList.remove("visible")
    this.outputTarget.textContent = ""
    this.buttonTarget.disabled = false
    this.inputTarget.focus()
  }
}

