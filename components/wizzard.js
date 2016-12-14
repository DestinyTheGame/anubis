import { Step, Stepper, StepLabel, StepContent, RaisedButton } from 'material-ui/Stepper';
import React, { Component } from 'react';

export default class Wizzard extends Component {
  render() {
    const step = this.props.step;

    return (
      <Stepper activeStep={ step } orientation='vertical'>
        <Step>
          <StepLabel>Setup Anubis</StepLabel>
          <StepContent>
            <p>
              For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.
            </p>

            <div>
              <RaisedButton label="Authenticate with Twitch" primary={ true } />
            </div>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Create an ad group</StepLabel>
          <StepContent>
            <p>
              An ad group contains one or more ads which target a shared set of keywords.
            </p>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Create an ad</StepLabel>
          <StepContent>
            <p>
              Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.
            </p>
          </StepContent>
        </Step>
      </Stepper>
    );
  }
}
