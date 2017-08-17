// @flow
import React from 'react'
import classNames from 'classnames'
import { remote } from 'electron'
import Database from 'api/Database'
import { DISCLAIMER } from 'api/Database/Settings/SettingsConstants'

import backgroundImage from 'images/bg.jpg'
import { name } from '../../package.json'

import type { Props, State } from './DisclaimerTypes'
import classes from './Disclaimer.scss'

export default class extends React.Component {

  props: Props

  state: State = {
    loading: true,
  }

  componentWillMount() {
    const { history } = this.props

    Database.settings.get(DISCLAIMER).then(({ docs }) => {
      if (docs) {
        history.push('/movies')

      } else {
        this.setState({
          loading: false,
        })
      }
    })
  }

  handleLeave = () => {
    const window = remote.getCurrentWindow()
    window.close()
  }

  handleAccept = () => {
    const { history } = this.props

    Database.settings.add(DISCLAIMER, true).then(() => {
      history.push('/movies')
    })
  }

  render() {
    const { loading } = this.state

    if (loading) {
      return null
    }

    return (
      <div className={classes.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={classes.disclaimer}>
          <div className={classes.disclaimer__head}>
            Terms of Service
          </div>
          <div className={classes.disclaimer__content}>
            <h2>Your Acceptance</h2>

            <p>
              By using the {name} app you signify your agreement to (1) these terms and conditions (the Terms of
              Service').
              <br />
              <br />
            </p>

            <h2>Privacy Policy.</h2>

            <p>You understand that by using {name} you may encounter material that you may deem to be offensive,
              indecent,
              or objectionable, and that such content may or may not be identified as having explicit material. {name}
              will have no liability to you for such material – you agree that your use of {name} is at your sole
              risk.<br /><br />
            </p>

            <h2>DISCLAIMERS</h2>

            <p>YOU EXPRESSLY AGREE THAT YOUR USE OF {name} IS AT YOUR SOLE RISK. {name} AND ALL PRODUCTS ARE PROVIDED TO
              YOU “AS IS” WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. {name} MAKES ABSOLUTELY NO
              WARRANTIES
              WHATSOEVER, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT POSSIBLE UNDER APPLICABLE LAWS, YIFY DISCLAIMS ALL
              WARRANTIES, EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR OTHER VIOLATIONS OF RIGHTS.
              <br />
              <br />
            </p>

            <h2>LIMITATION OF LIABILITY</h2>

            <p>{name} IS NOT RESPONSIBLE FOR ANY PROBLEMS OR TECHNICAL MALFUNCTION OF ANY WEBSITE, NETWORK, COMPUTER
              SYSTEMS, SERVERS, PROVIDERS, COMPUTER EQUIPMENT, OR SOFTWARE, OR FOR ANY FAILURE DUE TO TECHNICAL PROBLEMS
              OR TRAFFIC CONGESTION ON THE INTERNET OR {name} OR COMBINATION THEREOF, INCLUDING ANY INJURY OR DAMAGE TO
              USERS OR TO ANY COMPUTER OR OTHER DEVICE ON OR THROUGH WHICH {name} IS PROVIDED. UNDER NO CIRCUMSTANCES
              WILL {name} BE LIABLE FOR ANY LOSS OR DAMAGE, INCLUDING PERSONAL INJURY OR DEATH, RESULTING FROM YOUR USE
              OF {name}.
              <br /><br />
            </p>

            <h2> SOURCE MATERIAL</h2>

            <p>ALL MOVIES ARE NOT HOSTED ON ANY SERVER AND ARE STREAMED USING THE P2P BIT TORRENT PROTOCOL. ALL MOVIES
              ARE
              PULLED IN FROM OPEN PUBLIC APIS. BY WATCHING A MOVIE WITH THIS APPLICATION YOU MIGHT BE COMMITTING
              COPYRIGHT
              VIOLATIONS DEPENDING ON YOUR COUNTRY´S LAWS. WE DO NOT TAKE ANY RESPONSIBILITIES.
              <br />
              <br />
            </p>

            <h2>Ability to Accept Terms of Service</h2>

            <p>By using {name} or accessing this site you affirm that you are either more than 18 years of age, or an
              emancipated minor, or possess legal parental or guardian consent, and are fully able and competent to
              enter
              into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these
              Terms of Service, and to abide by and comply with these Terms of Service. In any case, you affirm that you
              are over the age of 13, as the Service is not intended for children under 13. If you are under 13 years of
              age, then please do not use the Service. There are lots of other great web sites for you. Talk to your
              parents about what sites are appropriate for you.</p>
          </div>
        </div>

        <div className={classes.disclaimer__actions}>

          <div>
            <button
              style={{ zIndex: 1060 }}
              className={classNames('pct-btn pct-btn-trans pct-btn-outline pct-btn-round', classes['actions--accept'])}
              onClick={this.handleAccept}>
              I Accept
            </button>
          </div>

          <div>
            <button
              style={{ zIndex: 1060 }}
              className={classNames('pct-btn pct-btn-trans pct-btn-outline pct-btn-round', classes['actions--leave'])}
              onClick={this.handleLeave}>
              Leave
            </button>
          </div>

        </div>
      </div>
    )
  }
}
