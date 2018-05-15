import React, { ReactNode } from 'react';

import { Publication, Rendition } from 'readium-ng';

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

  private root: HTMLElement | null = null;

  private rendition?: Rendition;

  private publication: Publication | undefined;

  constructor(props: IReadiumNGViewProps) {
    super(props);
    this.updateRoot = this.updateRoot.bind(this);
  }

  public render(): ReactNode {
    return (
      <div style={ { width: this.props.viewportWidth, height: this.props.viewportHeight, margin: 'auto'} }
        ref={ this.updateRoot } className="reader-container"></div>
    );
  }

  public async componentDidMount(): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }

    await this.openPublication(`${location.origin}/assets/publications/metamorphosis/`);
  }

  public updateRoot(root: HTMLElement | null): void {
    this.root = root;
  }

  public async openPublication(webpubUrl: string): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }
    this.publication = await Publication.fromURL(webpubUrl);
    this.rendition = new Rendition(this.publication, this.root);
    this.rendition.setViewAsVertical(this.props.viewAsVertical);

    const viewportSize = this.props.viewAsVertical ? this.props.viewportHeight :
                                                     this.props.viewportWidth;
    this.rendition.viewport.setViewportSize(viewportSize);
    this.rendition.viewport.setPrefetchSize(Math.ceil(viewportSize * 0.1));

    this.rendition.setPageSize(this.props.pageWidth, this.props.pageHeight);

    this.props.onRenditionCreated(this.rendition);

    this.rendition.render();
    this.rendition.viewport.enableScroll(this.props.enableScroll);

    this.rendition.viewport.renderAtOffset(0);
    // await this.viewport.renderAtSpineItem(4);
  }
}
