import RaisedButton from 'material-ui/RaisedButton';

import React, { ReactNode } from 'react';

import { Navigator } from 'readium-ng';

export interface IReadiumNGNavControlProps {
  navigator: Navigator | null;
}

export class ReadiumNGNavControl extends React.Component<IReadiumNGNavControlProps, {}> {
  constructor(props: IReadiumNGNavControlProps) {
    super(props);
    this.state = { ngViewport: null };
    this.prevScreen = this.prevScreen.bind(this);
    this.nextScreen = this.nextScreen.bind(this);
  }

  public render(): ReactNode {
    return (
      <div style={ { width: '600px', margin: 'auto' } } className="navigation-container">
        <RaisedButton className="navigation-button" style={ { margin: '5px' } } onClick={ this.prevScreen }>Prev</RaisedButton>
        <RaisedButton className="navigation-button" style={ { margin: '5px', float: 'right' } } onClick={ this.nextScreen }>Next</RaisedButton>
      </div>
    );
  }

  private async nextScreen(): Promise<void> {
    if (this.props.navigator) {
      await this.props.navigator.nextScreen();
    }
  }

  private async prevScreen(): Promise<void> {
    if (this.props.navigator) {
      await this.props.navigator.previousScreen();
    }
  }

}
