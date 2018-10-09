import React, { ReactNode } from 'react';

import { IFrameLoader,
         Publication,
         R2ContentViewFactory as ContentViewFactory,
         Rendition,
         SpreadMode } from '@evidentpoint/r2-navigator-web';

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
      border: '1px dashed black',
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
    // tslint:disable-next-line:max-line-length
    // await this.openPublication(`${location.origin}/assets/publications/regime-anticancer-arabic/`);
  }

  public updateRoot(root: HTMLElement | null): void {
    this.root = root;
  }

  public async openPublication(webpubUrl: string): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }
    this.publication = await Publication.fromURL(webpubUrl);

    const loader = new IFrameLoader(this.publication.getBaseURI());
    loader.setReadiumCssBasePath('/assets/readium-css');

    const cvf = new ContentViewFactory(loader);
    // const cvf = new ContentViewFactory(this.publication);
    this.rendition = new Rendition(this.publication, this.root,
                                   cvf);
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
    // await this.rendition.viewport.renderAtSpineItem(4);
  }
}
