import React, { ReactNode } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ReadiumNGNavControl } from './ng-nav-control';
import { ReadiumNGView } from './ng-view';
import { ReadiumNGViewSetting } from './ng-view-setting';

import { Navigator, Rendition } from 'readium-ng';

export interface IReadiumNGViewerStates {
  rendition: Rendition | null;
  navigator: Navigator | null;
  enableScroll: boolean;
  viewAsVertical: boolean;
}

export class ReadiumNGViewer extends React.Component<{}, IReadiumNGViewerStates> {

  constructor(props: {}) {
    super(props);
    this.state = { rendition: null, navigator: null, enableScroll: false, viewAsVertical: false };
    this.renditionUpdated = this.renditionUpdated.bind(this);
    this.viewParamsChanged = this.viewParamsChanged.bind(this);
  }

  public renditionUpdated(rend: Rendition): void {
    this.setState({ rendition: rend, navigator: new Navigator(rend) });
  }

  public viewParamsChanged(scroll: boolean, vertical: boolean): void {
    this.setState({ enableScroll: scroll, viewAsVertical: vertical });
  }

  public render(): ReactNode {
    return (
      <MuiThemeProvider>
        <div className="main-container">
          <ReadiumNGViewSetting
            rendition={ this.state.rendition } onViewParamsChanged={ this.viewParamsChanged }/>
          <ReadiumNGView
            viewportWidth={ 800 } viewportHeight={ 800 } pageWidth={ 400 } pageHeight={ 800 }
            enableScroll={ this.state.enableScroll } viewAsVertical={ this.state.viewAsVertical }
            onRenditionCreated={ this.renditionUpdated }/>
          <ReadiumNGNavControl navigator={ this.state.navigator }/>
        </div>
      </MuiThemeProvider>
    );
  }

}