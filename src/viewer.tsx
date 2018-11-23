import React, { CSSProperties, ReactNode } from 'react';

import { ReadiumNGNavControl } from './ng-nav-control';
import { ReadiumNGView } from './ng-view';
import { ReadiumNGViewSetting } from './ng-view-setting';

import { Navigator, Rendition } from '@readium/navigator-web';

export interface IReadiumNGViewerStates {
  rendition: Rendition | null;
  navigator: Navigator | null;
}

export class ReadiumNGViewer extends React.Component<{}, IReadiumNGViewerStates> {

  constructor(props: {}) {
    super(props);
    this.state = { rendition: null, navigator: null };
    this.renditionUpdated = this.renditionUpdated.bind(this);
  }

  public renditionUpdated(rend: Rendition): void {
    this.setState({ rendition: rend, navigator: new Navigator(rend) });
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
        <ReadiumNGNavControl navigator={ this.state.navigator }
                             style={ { gridArea: 'NavControl' } }/>
        <ReadiumNGViewSetting
          rendition={ this.state.rendition }
          navigator={ this.state.navigator}
          style={ { gridArea: 'ViewSetting' } }/>
      </div>
    );
  }

}
