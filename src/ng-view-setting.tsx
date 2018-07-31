import React, { ReactNode } from 'react';

import { Navigator, Rendition, SpreadMode } from 'readium-ng';

export interface IReadiumNGViewSettingProps {
  rendition: Rendition | null;
  navigator: Navigator | null;
}

export interface IReadiumNGViewerSettingStates {
  pageWidth: number;
  fontSize: number;
  spreadMode: string;
}

export class ReadiumNGViewSetting extends
  React.Component<IReadiumNGViewSettingProps, IReadiumNGViewerSettingStates> {

  constructor(props: IReadiumNGViewSettingProps) {
    super(props);
    this.state = { pageWidth: 400, fontSize: 100, spreadMode: 'freeform' };
    this.saveViewSetting = this.saveViewSetting.bind(this);
    this.savePageWidth = this.savePageWidth.bind(this);
    this.saveSpreadMode = this.saveSpreadMode.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSpreadModeChange = this.handleSpreadModeChange.bind(this);
  }

  public render(): ReactNode {
    return (
      <div>
        <label>
          Page Width:
          <input type="text" name="pageWidth" value={ this.state.pageWidth }
                 onChange={ this.handleChange } />
        </label>
        <button onClick={ this.savePageWidth }>Update</button>
        <label>
          Font Size:
          <input type="text" name="fontSize" value={ this.state.fontSize }
                 onChange={ this.handleChange } />
        </label>
        <button onClick={ this.saveViewSetting }>Update</button>
        <label>
          Spread Mode:
          <select value={ this.state.spreadMode } onChange={ this.handleSpreadModeChange }>
            <option value="freeform" aria-selected="true">Freeform</option>
            <option value="auto" aria-selected="false">Auto</option>
            <option value="single" aria-selected="false">Single</option>
            <option value="double" aria-selected="false">Double</option>
          </select>
        </label>
        <button onClick={ this.saveSpreadMode }>Update</button>
      </div>
    );
  }

  // tslint:disable-next-line:no-any
  private handleChange(event: React.FormEvent<HTMLInputElement>): void {
    const newVal = parseInt(event.currentTarget.value, 10);
    if (isNaN(newVal)) {
      return;
    }

    const elementName = event.currentTarget.name;
    if (elementName === 'pageWidth') {
      this.setState({ pageWidth: newVal });
    } else if (elementName === 'fontSize') {
      this.setState({ fontSize: newVal });
    }
  }

  private handleSpreadModeChange(event: React.FormEvent<HTMLSelectElement>): void {
    this.setState({ spreadMode: event.currentTarget.value });
  }

  private async saveViewSetting(): Promise<void> {
    if (!this.props.rendition) {
      return;
    }

    await this.props.rendition.updateViewSettings({ fontSize: this.state.fontSize });

    this.props.rendition.viewport.renderAtOffset(0);
  }

  private savePageWidth(): void {
    if (!this.props.rendition) {
      return;
    }

    this.props.rendition.setPageLayout({
      spreadMode: SpreadMode.Freeform,
      pageWidth: this.state.pageWidth,
      pageHeight: 800,
    });

    this.props.rendition.viewport.renderAtOffset(0);
  }

  private async saveSpreadMode(): Promise<void> {
    if (!this.props.rendition || !this.props.navigator) {
      return;
    }

    const newVal = this.state.spreadMode;
    let spreadMode = SpreadMode.Freeform;
    if (newVal === 'auto') {
      spreadMode = SpreadMode.FitViewportAuto;
    } else if (newVal === 'single') {
      spreadMode = SpreadMode.FitViewportSingleSpread;
    } else if (newVal === 'double') {
      spreadMode = SpreadMode.FitViewportDoubleSpread;
    }

    const loc = await this.props.navigator.getCurrentLocationAsync();

    await this.props.rendition.setPageLayout({
      spreadMode,
      pageWidth: this.state.pageWidth,
      pageHeight: 800,
    });

    if (loc) {
      await this.props.navigator.gotoLocation(loc);
    }
  }

}
