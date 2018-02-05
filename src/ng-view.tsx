import React, { ReactNode } from 'react';

// tslint:disable-next-line:no-implicit-dependencies
import { LayoutView, Publication, StreamerClient, Viewport } from 'readium-ng';

export interface IReadiumNGViewProps {
  viewportWidth: number;
  viewportHeight: number;
  pageHeight: number;
  pageWidth: number;
  onViewportCreated(vp: Viewport): void;
}

export class ReadiumNGView extends React.Component<IReadiumNGViewProps, {}> {
  private streamerClient: StreamerClient;

  private root: HTMLElement | null = null;

  private viewport: Viewport | null = null;

  private publication: Publication | undefined;

  constructor(props: IReadiumNGViewProps) {
    super(props);
    this.streamerClient = new StreamerClient();
    this.updateRoot = this.updateRoot.bind(this);
  }

  public render(): ReactNode {
    return (
      <div style={ { width: this.props.viewportWidth, height: this.props.viewportHeight } }
        ref={ this.updateRoot }></div>
    );
  }

  public async componentDidMount(): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }

    this.viewport = new Viewport(this.root);
    this.props.onViewportCreated(this.viewport);

    await this.openPublication('/asserts/publications/metamorphosis/manifest.json');
  }

  public updateRoot(root: HTMLElement | null): void {
    this.root = root;
  }

  public async openPublication(webpubUrl: string): Promise<void> {
    if (!this.viewport) {
      return Promise.resolve();
    }

    this.publication = await this.streamerClient.openPublicationFromUrl(webpubUrl);

    const layoutView = new LayoutView(this.publication);
    layoutView.setPageSize(this.props.pageWidth, this.props.pageHeight);

    this.viewport.setView(layoutView);
    this.viewport.setViewportSize(this.props.viewportWidth);

    await this.viewport.renderAtOffset(0);
    // await this.viewport.renderAtSpineItem(4);
  }

  
}
