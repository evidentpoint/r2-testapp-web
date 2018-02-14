import React, { ReactNode } from 'react';

import { ReadiumNGNavControl } from './ng-nav-control';
import { ReadiumNGView } from './ng-view';

import { Navigator, Rendition } from 'readium-ng';

export interface IReadiumNGViewerStates {
  navigator: Navigator | null;
}

export class ReadiumNGViewer extends React.Component<{}, IReadiumNGViewerStates> {

  constructor(props: {}) {
    super(props);
    this.state = { navigator: null };
    this.renditionUpdated = this.renditionUpdated.bind(this);
  }

  public renditionUpdated(rend: Rendition): void {
    this.setState({ navigator: new Navigator(rend) });
  }

  public render(): ReactNode {
    return (
      <div>
        <ReadiumNGView
          viewportWidth={ 600 } viewportHeight={ 800 } pageWidth={ 400 } pageHeight={ 800 }
          enableScroll={ true } viewAsVertical={ false }
          onRenditionCreated={ this.renditionUpdated }/>
        <ReadiumNGNavControl navigator={ this.state.navigator }/>
      </div>
    );
  }

}
