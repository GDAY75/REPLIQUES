import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "form", "container", "button", "wait", "question", "questionQuote", "video", "context"]

  static values = { delay: Number }

  connect() {
    this._timer = null
    this._contextTimer = null
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
    if (this._contextTimer) clearTimeout(this._contextTimer)
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

    this.containerTarget.classList.add("fullscreen", "is-waiting")
    this.formTarget.classList.add("hidden")
    this.buttonTarget.disabled = true
    this.waitTarget.classList.add("visible")

    const delay = Number.isFinite(this.delayValue) ? this.delayValue : 1200
    this._timer = setTimeout(() => {
      this.waitTarget.classList.remove("visible")

      this.containerTarget.classList.remove("is-waiting")
      this.containerTarget.classList.add("reveal")

      // démarre la vidéo
      try {
        this.videoTarget.currentTime = 0
        this.videoTarget.muted = false
        this.videoTarget.volume = 1
        const p = this.videoTarget.play()
        if (p && typeof p.catch === "function") p.catch((err) => console.warn(err))
      } catch (_) {}

      // Contexte 3 secondes après
      this.contextTarget.textContent = ""
      this.contextTarget.classList.remove("visible")

      this._contextTimer = setTimeout(() => {
        const context = this.pickContext()
        this.contextTarget.textContent = context
        this.contextTarget.classList.add("visible")
      }, 3000)
    }, delay)
  }

  reset() {
    if (this._timer) clearTimeout(this._timer)
    if (this._contextTimer) clearTimeout(this._contextTimer)
    this._timer = null
    this._contextTimer = null

    // stop vidéo
    if (this.hasVideoTarget) {
      this.videoTarget.pause()
      this.videoTarget.currentTime = 0
    }


    this._pendingText = null
    this._emotion = null

    this.containerTarget.classList.remove("fullscreen", "is-waiting", "reveal")
    this.formTarget.classList.remove("hidden")
    this.waitTarget.classList.remove("visible")

    // ferme l’overlay question si ouvert
    this.questionTarget.classList.remove("visible")
    this.questionTarget.setAttribute("aria-hidden", "true")

    this.buttonTarget.disabled = false
    this.inputTarget.focus()

    this.contextTarget.textContent = ""
    this.contextTarget.classList.remove("visible")

  }

  pickContext() {
    const common = [
      "Cette phrase pourrait être murmurée dans le noir.",
      "Cette phrase ressemble à un adieu doux.",
      "Cette phrase pourrait apparaître au bord des larmes.",
      "Cette phrase sonne comme une promesse fragile.",
      "Cette phrase pourrait être dite à voix basse, juste avant de partir.",
      "Cette phrase a le goût d’un souvenir qui revient.",
    ]

    const byEmotion = {
      Espoir: [
        "Cette phrase pourrait être dite au matin, quand tout redevient possible.",
        "Cette phrase sonne comme une lueur dans l'obscurité.",
      ],
      Amour: [
        "Cette phrase pourrait être murmurée tout près, sans témoin.",
        "Cette phrase ressemble à une carresse.",
      ],
      Solitude: [
        "Cette phrase pourrait résoner dans une pièce vide.",
        "Cette phrase ressemble à un message jamais envoyé.",
      ],
    }

    const pool = (byEmotion[this._emotion] || []).concat(common)
    return pool[Math.floor(Math.random() * pool.length)]
  }
}
