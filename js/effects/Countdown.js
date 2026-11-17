/**
 * Contagem regressiva até o próximo drop: toda sexta-feira às 20h.
 *
 *   <div data-countdown>
 *     <strong data-unit="days">00</strong> ...
 */
export class Countdown {
  start() {
    this.root = document.querySelector("[data-countdown]");
    if (!this.root) return;
    this.units = {
      days: this.root.querySelector('[data-unit="days"]'),
      hours: this.root.querySelector('[data-unit="hours"]'),
      minutes: this.root.querySelector('[data-unit="minutes"]'),
      seconds: this.root.querySelector('[data-unit="seconds"]')
    };
    this.deadline = Countdown.nextDrop();
    this.#tick();
    window.setInterval(() => this.#tick(), 1000);
  }

  /** Calcula a data da próxima sexta-feira às 20:00. */
  static nextDrop(from = new Date()) {
    const drop = new Date(from);
    drop.setHours(20, 0, 0, 0);
    const daysUntilFriday = (5 - from.getDay() + 7) % 7; // getDay(): domingo=0 ... sexta=5
    drop.setDate(drop.getDate() + daysUntilFriday);
    if (drop <= from) drop.setDate(drop.getDate() + 7); // já passou? próxima semana
    return drop;
  }

  #tick() {
    const remaining = Math.max(0, this.deadline - Date.now());
    if (remaining === 0) this.deadline = Countdown.nextDrop();

    const parts = {
      days: Math.floor(remaining / 86_400_000),
      hours: Math.floor(remaining / 3_600_000) % 24,
      minutes: Math.floor(remaining / 60_000) % 60,
      seconds: Math.floor(remaining / 1000) % 60
    };
    for (const [unit, value] of Object.entries(parts)) {
      this.units[unit].textContent = String(value).padStart(2, "0");
    }
  }
}
