import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "output"]

  show() {
    const text = this.inputTarget.value.trim()
    this.outputTarget.textContent = text.length ? text : "…"
  }

  connect() {
    this.inputTarget.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.show()
    })
  }
}
