import React, { Component } from 'react';
import Character from './character';
import Tooltip from 'react-tooltip';
import Equipped from './equipped';
import Emblem from './emblem';
import Stats from './stats';
import Elo from './elo';

/**
 * Fireteam component.
 *
 * @constructor
 * @private
 */
export default class Fireteam extends Component {
  constructor(props) {
    super(...arguments);

    this.members = props.members.map((data) => {
      return Object.assign(data, {
        character: new Character(data.character, data.inventory.data, data.inventory.definitions),
      });
    });
  }

  /**
   * Return the various armor stats.
   *
   * @returns {Component}
   * @private
   */
  stats(data) {
    const { character } = data;
    const { armor, agility, recovery } = character.build();

    return (
      <div className='base'>
        <Stats name='Armour' value={ armor } />
        <Stats name='Recovery' value={ recovery } />
        <Stats name='Agility' value={ agility } />
      </div>
    );
  }

  /**
   * Render the emblem of a fireteam member including all of its details.
   *
   * @param {Object} data All the gathered data.
   * @returns {Component} User emblem.
   * @private
   */
  emblem(data) {
    const { character, kills, deaths } = data;
    const kd = (kills / deaths).toFixed(2);

    return (
      <Emblem { ...character.emblem() } kd={ kd } />
    );
  }

  /**
   * Render the abilities.
   *
   * @param {Object} data All the gathered data.
   * @returns {Component} The users abilities.
   * @private
   */
  abilities(data) {
    const { character } = data;
    const { intellect, discipline, strength } = character.abilities();

    return (
      <div className='abilities'>
        <dl>
          <dt>Intellect</dt>
          <dd>
            T{ intellect.tier }

            <span className='cooldown'>
              { intellect.cooldown }
            </span>
          </dd>
        </dl>
        <dl>
          <dt>Discipline</dt>
          <dd>
            T{ discipline.tier }

            <span className='cooldown'>
              { discipline.cooldown }
            </span>
          </dd>
        </dl>
        <dl>
          <dt>Strength</dt>
          <dd>
            T{ strength.tier }

            <span className='cooldown'>
              { strength.cooldown }
            </span>
          </dd>
        </dl>
      </div>
    );
  }

  /**
   * Get all the gear that the user is wearing.
   *
   * @param {Object} data All the gathered data.
   * @returns {Component} The users loadout.
   * @private
   */
  gear(data) {
    if (this.props.small) return;

    const { character } = data;
    const { primary, special, heavy, artifact, armor } = character.loadout();

    return (
      <div className='loadout'>
        <Equipped { ...primary } />
        <Equipped { ...special } />
        <Equipped { ...heavy } />

        <Equipped { ...armor } />
        <Equipped { ...artifact } />
      </div>
    );
  }

  /**
   * Render the Fireteam component.
   *
   * @returns {Component}
   * @private
   */
  render() {
    return (
      <div className='fireteam'>
        {
          this.members.map((data, index) => {
            return (
              <div className='member' key={ 'loadout'+ index }>
                { this.emblem(data) }

                <div className='tiers'>
                  { this.stats(data) }
                  { this.abilities(data) }
                </div>

                { this.gear(data) }
              </div>
            );
          })
        }

        <Tooltip html={ true } />
      </div>
    );
  }
}
