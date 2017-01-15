/**
 * Representation the interesting trials information we can extract from the
 * API.
 *
 * @constructor
 * @param {Object} trials Trials activity.
 * @public
 */
export default class Trials {
  constructor(trials) {
    const progress = trials.extended.scoreCard;
    const card = progress.ticketItem || {};
    const nodes = card.nodes;

    this.boons = {
      mercy: nodes ? nodes[0].isActivated : false,    // nodeHash: 0
      favor: nodes ? nodes[1].isActivated : false,    // nodeHash: 1
      boldness: nodes ? nodes[2].isActivated : false  // nodeHash: 2
    };

    this.wins = progress.wins;
    this.losses = progress.losses;
    this.max = {
      wins: progress.maxWins,
      loss: progress.maxLosses
    };

    //
    // Some more specific information that we can gather by checking data.
    //
    // lighthouse: Enough games have been won to grant access to the lighthouse.
    // mercy: Indication if mercy has been used.
    //
    this.lighthouse = this.wins >= 9;
    this.mercy = this.boons.mercy && this.losses === -1;
  }

  /**
   * Return win or lose streaks of the card.
   *
   * @param {Boolean} unfilled Show unfilled dots.
   * @param {Boolean} wins Return win progress instead of loss
   * @returns {Array} Card progress.
   * @private
   */
  progress(unfilled, wins) {
    //
    // It's important to check the length of losses as when mercy is used it
    // gets a negative value and we cannot create an array with a negative size.
    //
    const dots = wins
    ? new Array(unfilled ? this.max.wins : this.wins)
    : new Array(unfilled ? this.max.loss : this.losses > 0 ? this.losses : 0);

    return dots.fill(true).map((item, i) => i < this[wins ? 'wins' : 'losses']);
  }

  /**
   * Get all won rounds.
   *
   * @returns {Array} Wins on the card.
   * @public
   */
  won() {
    return this.progress(true, true);
  }

  /**
   * Get all loss rounds.
   *
   * @returns {Array} Loss on the card.
   * @public
   */
  loss() {
    return this.progress(true, false);
  }

  /**
   * A JSON export of the details.
   *
   * @returns {Object}
   * @public
   */
  toJSON() {
    return {
      wins: this.wins,
      losses: this.losses,
      boons: {
        mercy: this.boons.mercy,
        favor: this.boons.favor,
        boldness: this.boons.boldness
      }
    };
  }
}
