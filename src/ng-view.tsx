import React, { CSSProperties, ReactNode } from 'react';

import { IFrameLoader,
         Publication,
         R2ContentViewFactory as ContentViewFactory,
         Rendition,
         RenditionContext,
         ScrollMode,
         SpreadMode,
         ViewportResizer } from '@readium/navigator-web';

export interface IReadiumNGViewProps {
  style?: CSSProperties;
  pageHeight: number;
  pageWidth: number;
  enableScroll: boolean;
  viewAsVertical: boolean;
  onRenditionCreated(rendCtx: RenditionContext): void;
}

const ASSETS_URL = new URL('./assets', window.location.href).toString();

export class ReadiumNGView extends React.Component<IReadiumNGViewProps, {}> {

  private root: HTMLElement | null = null;
  private viewportRoot: HTMLElement | null = null;

  private rendCtx?: RenditionContext;

  private resizer?: ViewportResizer;

  private publication: Publication | undefined;

  private viewportWidth: number = 0;
  private viewportHeight: number = 0;

  constructor(props: IReadiumNGViewProps) {
    super(props);
    this.updateRoot = this.updateRoot.bind(this);
    this.updateViewportRoot = this.updateViewportRoot.bind(this);
    this.onViewportResize = this.onViewportResize.bind(this);
  }

  public render(): ReactNode {
    const containerStyle: CSSProperties = {
      position: 'relative',
      border: '1px dashed black',
    };

    Object.assign(containerStyle, this.props.style);

    return (
      <div style={ containerStyle }
        ref={ this.updateRoot }>
        <div id="viewport" ref={ this.updateViewportRoot }
             style={{ position: 'absolute' }}/>
      </div>
    );
  }

  public componentWillUnmount(): void {
    this.cleanupResizer();
  }

  public async componentDidMount(): Promise<void> {
    if (!this.root) {
      return Promise.resolve();
    }

    this.updateSize();

    // Reflow LTR:
    await this.openPublication(
        `${ASSETS_URL}/publications/metamorphosis/manifest.json`);

    // // FXL:
    // await this.openPublication(
    //     `${ASSETS_URL}/publications/igp-twss-fxl/manifest.json`);

    // // Reflow RTL:
    // await this.openPublication(
    //     `${ASSETS_URL}/publications/regime-anticancer-arabic/manifest.json`);
  }

  public updateRoot(root: HTMLElement | null): void {
    this.root = root;
  }

  public async openPublication(webpubUrl: string): Promise<void> {
    if (!this.root || !this.viewportRoot) {
      return;
    }
    this.publication = await Publication.fromURL(webpubUrl);

    const loader = new IFrameLoader(this.publication.getBaseURI());
    loader.setReadiumCssBasePath(`${ASSETS_URL}/readium-css`);

    const cvf = new ContentViewFactory(loader);
    // const cvf = new ContentViewFactory(this.publication);
    const rendition = new Rendition(this.publication, this.viewportRoot,
                                    cvf);
    rendition.setViewAsVertical(this.props.viewAsVertical);

    const viewportSize = this.props.viewAsVertical ? this.viewportHeight :
                                                     this.viewportWidth;
    const viewportSize2nd = this.props.viewAsVertical ? this.viewportWidth :
                                                        this.viewportHeight;

    rendition.viewport.setViewportSize(viewportSize, viewportSize2nd);
    rendition.viewport.setPrefetchSize(Math.ceil(viewportSize * 0.1));
    rendition.setPageLayout({
      spreadMode: SpreadMode.FitViewportAuto,
      pageWidth: this.props.pageWidth,
      pageHeight: this.props.pageHeight,
    });

    rendition.render();

    const scrollMode = this.props.enableScroll ? ScrollMode.Publication : ScrollMode.None;
    rendition.viewport.setScrollMode(scrollMode);

    this.rendCtx = new RenditionContext(rendition, loader);
    this.props.onRenditionCreated(this.rendCtx);

    this.resizer = new ViewportResizer(this.rendCtx, this.onViewportResize);

    await this.rendCtx.navigator.gotoBegin();
    // await this.rendition.viewport.renderAtSpineItem(4);
  }

  private updateViewportRoot(viewportRoot: HTMLElement | null): void {
    this.viewportRoot = viewportRoot;
  }

  private onViewportResize(): void {
    this.updateSize();
  }

  private cleanupResizer(): void {
    if (this.resizer) {
      this.resizer.stopListenResize();
    }
  }

  private updateSize(): void {
    if (!this.root || !this.viewportRoot) {
      return;
    }

    this.viewportRoot.style.width = `${this.root.clientWidth}px`;
    this.viewportRoot.style.height = `${this.root.clientHeight}px`;

    const scrollerWidthAdj = this.props.enableScroll ? 15 : 0;
    this.viewportWidth = this.root.clientWidth - scrollerWidthAdj;
    this.viewportHeight = this.root.clientHeight;

    if (this.rendCtx) {
      const viewportSize = this.props.viewAsVertical ? this.viewportHeight : this.viewportWidth;
      const viewportSize2nd = this.props.viewAsVertical ? this.viewportWidth : this.viewportHeight;
      this.rendCtx.rendition.viewport.setViewportSize(viewportSize, viewportSize2nd);
      this.rendCtx.rendition.refreshPageLayout();
    }
  }
}
