import React, { ReactNode } from 'react';

// tslint:disable-next-line:no-implicit-dependencies
import { Viewport } from 'readium-ng';

export interface IReadiumNGNavControlProps {
  ngViewport: Viewport | null;
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
    if (this.props.ngViewport) {
      await this.props.ngViewport.nextScreen();
    }
  }

  private async prevScreen(): Promise<void> {
    if (this.props.ngViewport) {
      await this.props.ngViewport.prevScreen();
    }
  }

}
