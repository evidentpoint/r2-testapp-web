import React, { ReactNode } from 'react';

import { Publication, R1ContentViewFactory, Rendition, SpreadMode } from 'readium-ng';

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
    const readiumViewStyle = {
      margin: 'auto',
      width: this.props.viewportWidth,
      height: this.props.viewportHeight,
    };

    return (
      <div style={ readiumViewStyle }
        ref={ this.updateRoot }></div>
    );
  }

  public async componentDidMount(): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }

    await this.openPublication(`${location.origin}/assets/publications/metamorphosis/`);
    // await this.openPublication(`${location.origin}/assets/publications/igp-twss-fxl/`);
  }

  public updateRoot(root: HTMLElement | null): void {
    this.root = root;
  }

  public async openPublication(webpubUrl: string): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }
    this.publication = await Publication.fromURL(webpubUrl);
    this.rendition = new Rendition(this.publication, this.root,
                                   new R1ContentViewFactory(this.publication));
    this.rendition.setViewAsVertical(this.props.viewAsVertical);

    const viewportSize = this.props.viewAsVertical ? this.props.viewportHeight :
                                                     this.props.viewportWidth;
    const viewportSize2nd = this.props.viewAsVertical ? this.props.viewportWidth :
                                                        this.props.viewportHeight;

    this.rendition.viewport.setViewportSize(viewportSize, viewportSize2nd);
    this.rendition.viewport.setPrefetchSize(Math.ceil(viewportSize * 0.1));
    await this.rendition.setPageLayout({
      spreadMode: SpreadMode.FitViewportAuto,
      pageWidth: this.props.pageWidth,
      pageHeight: this.props.pageHeight,
    });

    this.props.onRenditionCreated(this.rendition);

    this.rendition.render();
    this.rendition.viewport.enableScroll(this.props.enableScroll);

    await this.rendition.viewport.renderAtOffset(0);
    // await this.viewport.renderAtSpineItem(4);
  }
}
