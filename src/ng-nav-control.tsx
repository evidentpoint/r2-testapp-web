import React, { ReactNode } from 'react';

import { Viewport } from 'readium-ng';

export interface IReadiumNGNavControlProps {
  ngViewport: Viewport;
}

export class ReadiumNGNavControl extends React.Component<IReadiumNGNavControlProps, {}> {

  public render(): ReactNode {
    return (
      <div>
        <button onClick={this.prevScreen.bind(this)}>Prev</button>
        <button onClick={this.nextScreen.bind(this)}>Next</button>
      </div>
    );
  }

  private async nextScreen(): Promise<void> {
    await this.props.ngViewport.nextScreen();
  }

  private async prevScreen(): Promise<void> {
    await this.props.ngViewport.prevScreen();
  }

}
