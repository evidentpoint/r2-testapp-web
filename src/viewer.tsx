import React, { ReactNode } from 'react';

import { ReadiumNGNavControl } from './ng-nav-control';
import { ReadiumNGView } from './ng-view';

import { Viewport } from 'readium-ng';

export interface IReadiumNGViewerStates {
  ngViewport: Viewport;
}

export class ReadiumNGViewer extends React.Component<{}, IReadiumNGViewerStates> {

  constructor(props: {}) {
    super(props);
    this.state = {ngViewport: null};
  }

  public viewportUpdated(newViewport: Viewport): void {
    console.log('viewportUpdated!');
    this.setState({ngViewport: newViewport});
  }

  public render(): ReactNode {
    return (
      <div>
        <ReadiumNGView viewportWidth={600} viewportHeight={800} pageWidth={400} pageHeight={800}
          onViewportCreated={this.viewportUpdated.bind(this)}/>
        <ReadiumNGNavControl ngViewport={this.state.ngViewport}/>
      </div>
    );
  }

}
