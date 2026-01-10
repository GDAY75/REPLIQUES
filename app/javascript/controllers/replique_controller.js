import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "input",
    "output",
    "form",
    "container",
    "button",
    "wait",
    "question",
    "questionQuote" // 👈 nouveau
  ]

  static values = { delay: Number }

  connect() {
    this._timer = null
    this._pendingText = null
    this._emotion = null

    this._onKeydown = (e) => {
      if (e.key === "Escape") this.reset()
      if (e.key === "Enter" && document.activeElement === this.inputTarget) this.askEmotion()
    }
    document.addEventListener("keydown", this._onKeydown)
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKeydown)
    if (this._timer) clearTimeout(this._timer)
  }

  // Étape 1 : on demande l’émotion
  askEmotion() {
    const text = this.inputTarget.value.trim()
    if (!text) return

    // stocke la phrase en attente
    this._pendingText = text

    // affiche la phrase entre guillemets dans la question
    this.questionQuoteTarget.textContent = `“${text}”`

    // affiche l'overlay question
    this.questionTarget.classList.add("visible")
    this.questionTarget.setAttribute("aria-hidden", "false")
  }

  // Étape 2 : l’utilisateur choisit -> on lance la reveal “comme d’habitude”
  chooseEmotion(event) {
    const emotion = event.currentTarget.dataset.emotion
    this._emotion = emotion

    // ferme l’overlay question
    this.questionTarget.classList.remove("visible")
    this.questionTarget.setAttribute("aria-hidden", "true")

    // lance le plein écran
    this.showPending()
  }

  showPending() {
    const text = (this._pendingText || "").trim()
    if (!text) return
    if (this.containerTarget.classList.contains("is-waiting")) return

    // (optionnel) si tu veux afficher l’émotion ailleurs plus tard :
    // console.log("Emotion choisie:", this._emotion)

    this.outputTarget.textContent = ""
    this.containerTarget.classList.add("fullscreen", "is-waiting")
    this.formTarget.classList.add("hidden")
    this.buttonTarget.disabled = true
    this.waitTarget.classList.add("visible")

    const delay = Number.isFinite(this.delayValue) ? this.delayValue : 1200
    this._timer = setTimeout(() => {
      this.waitTarget.classList.remove("visible")
      this.outputTarget.textContent = text

      this.containerTarget.classList.remove("is-waiting")
      this.containerTarget.classList.add("reveal")
    }, delay)
  }

  reset() {
    if (this._timer) clearTimeout(this._timer)
    this._timer = null

    this._pendingText = null
    this._emotion = null

    this.containerTarget.classList.remove("fullscreen", "is-waiting", "reveal")
    this.formTarget.classList.remove("hidden")
    this.waitTarget.classList.remove("visible")

    // ferme l’overlay question si ouvert
    this.questionTarget.classList.remove("visible")
    this.questionTarget.setAttribute("aria-hidden", "true")

    this.outputTarget.textContent = ""
    this.buttonTarget.disabled = false
    this.inputTarget.focus()
  }
}
