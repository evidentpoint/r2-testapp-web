import React, { CSSProperties, ReactNode } from 'react';

import { ReadiumNGView } from './ng-view';
import { ReadiumNGViewSetting } from './ng-view-setting';

import { Navigator, Rendition, RenditionContext, SettingName } from '@readium/navigator-web';

export interface IReadiumNGViewerStates {
  rendition: Rendition | null;
  navigator: Navigator | null;
  fontSize: number;
}

export class ReadiumNGViewer extends React.Component<{}, IReadiumNGViewerStates> {

  constructor(props: {}) {
    super(props);

    this.state = {
      rendition: null,
      navigator: null,

      // Start with a font size of 100(%?)
      fontSize: 100,
    };
    this.renditionUpdated = this.renditionUpdated.bind(this);

    // @ts-ignore
    if (!window.ReadiumSDK) {
      // @ts-ignore
      window.ReadiumSDK = {};
    }

    // Instead of rendering a navigation component, register as interface to be called from outside
    this.registerNavigation();

    // Instead of View Settings, register Settings interface to be called from outside
    this.registerViewSettingsInterface();
  }

  public renditionUpdated(rendCtx: RenditionContext): void {
    this.setState({ rendition: rendCtx.rendition, navigator: rendCtx.navigator });
  }

  public render(): ReactNode {
    const viewerContainerStyle: CSSProperties = {
      display: 'grid',
      gridTemplateRows: '1fr max-content max-content',
      gridTemplateAreas: `'BookContent'
                          'NavControl'
                          'ViewSetting'`,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    };

    return (
      <div style={ viewerContainerStyle }>
        <ReadiumNGView
          pageWidth={ 400 } pageHeight={ 900 }
          enableScroll={ false } viewAsVertical={ false }
          onRenditionCreated={ this.renditionUpdated }
          style={ { gridArea: 'BookContent' } }/>

        {/*
        <ReadiumNGViewSetting
          rendition={ this.state.rendition }
          navigator={ this.state.navigator}
          style={ { gridArea: 'ViewSetting' } }/>
          */}
      </div>
    );
  }

  public registerNavigation(): void {

    // @ts-ignore
    ReadiumSDK.nextScreen = async () : Promise<void> => {
      if (this.state.navigator) {
        await this.state.navigator.nextScreen();
      }
    };

    // @ts-ignore
    ReadiumSDK.prevScreen = async () : Promise<void> => {
      if (this.state.navigator) {
        await this.state.navigator.previousScreen();
      }
    };

  }

  public registerViewSettingsInterface(): void {

    // @ts-ignore
    ReadiumSDK.getCurrentFontSize = () : int => {
      // Currently implemented as a state in the Viewer
      // Should figure out if Navigator should have an API for this
      return this.state.fontSize;
    };

    // @ts-ignore
    ReadiumSDK.setFontSize = async (size : string) : void => {

      let loc;
      if (this.state.navigator) {
        loc = await this.state.navigator.getCurrentLocationAsync();
      }

      if (this.state.rendition !== null) {
        const newSetting = {
          name: SettingName.FontSize,
          value: size,
        };
        this.state.rendition.updateViewSettings([newSetting]);
      }

      if (loc && this.state.navigator) {
        await this.state.navigator.gotoLocation(loc);
      }

      // Will simply have to keep track of the Font Size in state
      this.setState({ fontSize: parseInt(size, 10) });

    };

  }

  public componentDidMount(): void {
    // @ts-ignore
    Android.showButtons(true);
  }

  public componentWillUnmount(): void {
    // @ts-ignore
    Android.showButtons(false);
  }

}
