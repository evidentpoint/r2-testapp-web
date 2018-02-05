import React, { ReactNode } from 'react';

import { LayoutView, Publication, StreamerClient, Viewport } from 'readium-ng';

export interface IReadiumNGViewProps {
  viewportWidth: number;
  viewportHeight: number;
  pageHeight: number;
  pageWidth: number;
  onViewportCreated(vp: Viewport): void;
}

export class ReadiumNGView extends React.Component<IReadiumNGViewProps, {}> {
  private layoutView: LayoutView;
  private publication: Publication;

  private streamerClient: StreamerClient;

  private root: HTMLElement | null = null;

  private viewport: Viewport;

  constructor(props: IReadiumNGViewProps) {
    super(props);
    this.streamerClient = new StreamerClient();
  }

  public render(): ReactNode {
    return (
      <div style={{ width: this.props.viewportWidth, height: this.props.viewportHeight }}
        ref={(root) => { this.root = root; }}></div>
    );
  }

  public async componentDidMount(): Promise<void> {
    this.viewport = new Viewport(this.root);
    this.props.onViewportCreated(this.viewport);

    await this.openPublication('/asserts/publications/metamorphosis/manifest.json');
  }

  public async openPublication(webpubUrl: string): Promise<void> {
    this.publication = await this.streamerClient.openPublicationFromUrl(webpubUrl);

    this.layoutView = new LayoutView(this.publication);
    this.layoutView.setPageSize(this.props.pageWidth, this.props.pageHeight);

    this.viewport.setView(this.layoutView);
    this.viewport.setViewportSize(this.props.viewportWidth);

    await this.viewport.renderAtOffset(0);
    // await this.viewport.renderAtSpineItem(4);
  }

  public async nextScreen(): Promise<void> {
    await this.viewport.nextScreen();
  }

  public async prevScreen(): Promise<void> {
    await this.viewport.prevScreen();
  }
}
