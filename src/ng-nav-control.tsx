import React, { CSSProperties, ReactNode } from 'react';

import { Navigator } from '@readium/navigator-web';

export interface IReadiumNGNavControlProps {
  style?: CSSProperties;
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
      <div>
        <button onClick={ this.prevScreen }>Prev</button>
        <button onClick={ this.nextScreen }>Next</button>
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
