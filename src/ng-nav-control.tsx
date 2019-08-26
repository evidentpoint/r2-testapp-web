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

    console.log('Navigation Controls Constructor Called');
  }

  public componentDidMount(): void {
    // @ts-ignore
    window.nextScreen = this.nextScreen;
    // @ts-ignore
    window.prevScreen = this.prevScreen;

    // @ts-ignore
    Android.showButtons(true);

    console.log('Navigation Controls Mounted');
  }

  public render(): null {
    // No longer render buttons, instead bind some functions to window
    // so it can be accessed by the native side

    return null;
  }

  public componentWillUnmount(): void {
    // @ts-ignore
    Android.showButtons(false);
  }

  public async nextScreen(): Promise<void> {
    if (this.props.navigator) {
      await this.props.navigator.nextScreen();
    }
  }

  public async prevScreen(): Promise<void> {
    if (this.props.navigator) {
      await this.props.navigator.previousScreen();
    }
  }

}
