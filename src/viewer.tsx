import React, { ReactNode } from 'react';

import { ReadiumNGNavControl } from './ng-nav-control';
import { ReadiumNGView } from './ng-view';

// tslint:disable-next-line:no-implicit-dependencies
import { Viewport } from 'readium-ng';

export interface IReadiumNGViewerStates {
  ngViewport: Viewport | null;
}

export class ReadiumNGViewer extends React.Component<{}, IReadiumNGViewerStates> {

  constructor(props: {}) {
    super(props);
    this.state = { ngViewport: null };
    this.viewportUpdated = this.viewportUpdated.bind(this);
  }

  public viewportUpdated(newViewport: Viewport): void {
    this.setState({ ngViewport: newViewport });
  }

  public render(): ReactNode {
    return (
      <div>
        <ReadiumNGView
          viewportWidth={ 600 } viewportHeight={ 800 } pageWidth={ 400 } pageHeight={ 800 }
          onViewportCreated={ this.viewportUpdated }/>
        <ReadiumNGNavControl ngViewport={ this.state.ngViewport }/>
      </div>
    );
  }

}
