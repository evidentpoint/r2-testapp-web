import React, { ReactNode } from 'react';

import { Publication, Rendition } from 'readium-ng';

import debounce from 'lodash.debounce';

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

  private isVertical: boolean = false;
  private isScrolling: boolean = false;

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

  public async componentDidUpdate(): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }

    debounce(async () => {
      const enableScroll = this.props.enableScroll;
      const viewAsVertical = this.props.viewAsVertical;

      console.log('scroll', enableScroll, 'vertical', viewAsVertical);

      if (this.isScrolling !== enableScroll || this.isVertical !== viewAsVertical) {
        await this.openPublication(`${location.origin}/assets/publications/metamorphosis/`);
      }

      this.isScrolling = enableScroll;
      this.isVertical = viewAsVertical;
    }, 400)();
  }

  public updateRoot(root: HTMLElement | null): void {
    this.root = root;
  }

  public async openPublication(webpubUrl: string): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }
    const newRoot = document.createElement('div');
    newRoot.style.width = String(this.props.viewportWidth);
    newRoot.style.height = String(this.props.viewportHeight);

    if (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
    }

    this.root.appendChild(newRoot);
    this.publication = await Publication.fromURL(webpubUrl);
    this.rendition = new Rendition(this.publication, newRoot);
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
