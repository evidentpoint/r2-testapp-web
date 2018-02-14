import React, { ReactNode } from 'react';

import { Publication, Rendition, StreamerClient } from 'readium-ng';

export interface IReadiumNGViewProps {
  viewportWidth: number;
  viewportHeight: number;
  pageHeight: number;
  pageWidth: number;
  enableScroll: boolean;
  viewAsVertical: boolean;
  onRenditionCreated(rend: Rendition): void;
}

export class ReadiumNGView extends React.Component<IReadiumNGViewProps, {}> {
  private streamerClient: StreamerClient;

  private root: HTMLElement | null = null;

  private rendition?: Rendition;

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

    await this.openPublication('/asserts/publications/metamorphosis/manifest.json');
  }

  public updateRoot(root: HTMLElement | null): void {
    this.root = root;
  }

  public async openPublication(webpubUrl: string): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }

    this.publication = await this.streamerClient.openPublicationFromUrl(webpubUrl);

    this.rendition = new Rendition(this.publication, this.root);
    this.rendition.setVeiwAsVertical(this.props.viewAsVertical);

    if (this.props.viewAsVertical) {
      this.rendition.viewport.setViewportSize(this.props.viewportHeight);
    } else {
      this.rendition.viewport.setViewportSize(this.props.viewportWidth);
    }

    this.rendition.setPageSize(this.props.pageWidth, this.props.pageHeight);

    this.props.onRenditionCreated(this.rendition);

    this.rendition.render();
    this.rendition.viewport.enableScroll(this.props.enableScroll);

    this.rendition.viewport.renderAtOffset(0);
    // await this.viewport.renderAtSpineItem(4);
  }
}
