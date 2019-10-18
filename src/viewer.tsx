import React, { CSSProperties, ReactNode } from 'react';

import { ReadiumNGNavControl } from './ng-nav-control';
import { ReadiumNGView } from './ng-view';
import { ReadiumNGViewSetting } from './ng-view-setting';

import {
  Navigator,
  Rendition,
  RenditionContext,
  SettingName,
  SpreadMode
} from '@readium/navigator-web';

export interface IReadiumNGViewerStates {
  rendition: Rendition | null;
  navigator: Navigator | null;
}

export class ReadiumNGViewer extends React.Component<{}, IReadiumNGViewerStates> {

  constructor(props: {}) {
    super(props);
    this.state = { rendition: null, navigator: null };
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
        {/*<ReadiumNGNavControl navigator={ this.state.navigator }*/}
        {/*                     style={ { gridArea: 'NavControl' } }/>*/}
        {/*<ReadiumNGViewSetting*/}
        {/*  rendition={ this.state.rendition }*/}
        {/*  navigator={ this.state.navigator}*/}
        {/*  style={ { gridArea: 'ViewSetting' } }/>*/}
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

    const updateSetting = async (setting : object, advanced: boolean = false) : Promise<void> => {
      let loc;
      if (this.state.navigator) {
        loc = await this.state.navigator.getCurrentLocationAsync();
      }

      if (this.state.rendition) {
        const input = [setting];
        if (advanced) {
          const isAdv = this.state.rendition.viewSettings()
            .getSetting(SettingName.AdvancedSettings);

          if (!isAdv) {
            input.push({
              name: SettingName.AdvancedSettings,
              value: 'readium-advanced-on',
            });
          }
        }
        // @ts-ignore
        this.state.rendition.updateViewSettings(input);
      }

      if (this.state.navigator && loc) {
        await this.state.navigator.gotoLocation(loc);
      }
    };

    // @ts-ignore
    ReadiumSDK.updateViewSetting = updateSetting;

    // @ts-ignore
    ReadiumSDK.getCurrentFontSize = () : int => {
      // Currently implemented as a state in the Viewer
      // Should figure out if Navigator should have an API for this
      if (this.state.rendition) {
        return this.state.rendition.viewSettings()
          .getSettingWithDefaultValue(SettingName.FontSize, 100);
      }

      return 100;
    };

    // @ts-ignore
    ReadiumSDK.setFontSize = (size : string) : void => {
      // @ts-ignore
      updateSetting({ name: SettingName.FontSize, value: size });

    };

    // @ts-ignore
    ReadiumSDK.setLineHeight = (height : string) : void => {
      updateSetting({ name: SettingName.LineHeight, value: height }, true);
    };

    // @ts-ignore
    ReadiumSDK.setTextAlignment = (align : string) : void => {
      updateSetting({ name: SettingName.TextAlign, value: align }, true);
    };

    // @ts-ignore
    ReadiumSDK.setViewMode = (mode : string) : void => {
      switch (mode) {
        case 'page':
          // tslint:disable-next-line:no-suspicious-comment
          // TODO
          break;
        case 'continuous':
          // tslint:disable-next-line:no-suspicious-comment
          // TODO
          break;
        default:
          console.error('Unknown View Mode');
      }
    };

    // Others

    // @ts-ignore
    ReadiumSDK.setBackgroundColour = (colour : string) => {
      // @ts-ignore
      updateSetting({ name: SettingName.BackgroundColor, value: colour });
    };

    // @ts-ignore
    ReadiumSDK.setSpreadMode = (mode : string) => {
      let spreadMode;

      switch (mode) {
        case 'single':
          spreadMode = SpreadMode.FitViewportSingleSpread;
          break;
        case 'double':
          spreadMode = SpreadMode.FitViewportDoubleSpread;
          break;
        case 'auto':
        default:
          spreadMode = SpreadMode.FitViewportAuto;
      }
      // @ts-ignore
      updateSetting({ name: SettingName.SpreadMode, value: spreadMode });
    };

  }

  public componentDidMount(): void {
    // tslint:disable-next-line:no-suspicious-comment
    // TODO
  }

  public componentWillUnmount(): void {
    // tslint:disable-next-line:no-suspicious-comment
    // TODO

    // @ts-ignore
    // Kill the SDK on unmount
    window.ReadiumSDK = undefined;
  }

}
