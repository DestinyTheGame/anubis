/**
 * Representation the interesting trials information we can extract from the
 * API.
 *
 * @constructor
 * @param {Object} trials Trials activity.
 * @param {Object} fake Which boons should we fake.
 * @public
 */
export default class Trials {
  constructor(trials, fake = {}) {
    const progress = trials.extended.scoreCard;
    const card = progress.ticketItem || {};
    const nodes = card.nodes;

    this.boons = {
      // nodeHash: 0
      mercy: (nodes ? nodes[0].isActivated : false),

      // nodeHash: 1
      favor: (nodes ? nodes[1].isActivated : false),

      // nodeHash: 2
      boldness: (nodes ? nodes[2].isActivated : false)
    };

    this.applied = false;
    this.wins = progress.wins;
    this.losses = progress.losses;
    this.max = {
      wins: progress.maxWins,
      loss: progress.maxLosses
    };

    //
    // Apply the fake boons if they exists, if not it will still update the
    // mercy/lighthouse game information.
    //
    this.apply(fake);
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
   * Apply fake boons to the card so we can simulate the UI on streams without
   * having to actually buy the boons.
   *
   * @param {Object} fake Boons that need to be applied.
   * @public
   */
  apply(fake = {}) {
    //
    // Process the boons that were given to us to see if we need to nuke a loss
    // or add extra wins etc. This needs to be processed before we set
    // lighthouse or mercy so we can override stuff
    //
    if (fake && !this.applied) {
      if (!this.boons.mercy && fake.mercy) {
        this.boons.mercy = true;
        this.losses--;
      }

      //
      // No really good way to check if we need to apply boldness. We can't
      // really see if we had a first win or not based on the returned data of
      // the API.
      //
      if (!this.boons.boldness && fake.boldness && this.wins) {
        this.boons.boldness = true;
        this.wins++;
      }

      if (!this.boons.favor && fake.favor) {
        this.boons.favor = true;
        this.wins++;
      }

      //
      // Prevent boons from being applied multiple times in a row as that would
      // lead to incorrect data.
      //
      this.applied = fake;
    }

    //
    // Some more specific information that we can gather by checking data.
    //
    // lighthouse: Enough games have been won to grant access to the lighthouse.
    // mercy: Indication if mercy has been used.
    //
    this.mercy = this.boons.mercy && this.losses === -1;
    this.lighthouse = this.wins >= 9;
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
  lost() {
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
