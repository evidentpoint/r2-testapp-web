import React, { ReactNode } from 'react';

import { Rendition } from 'readium-ng';

export interface IReadiumNGViewSettingProps {
  rendition: Rendition | null;
}

export interface IReadiumNGViewerSettingStates {
  pageWidth: number;
  fontSize: number;
}

export class ReadiumNGViewSetting extends
  React.Component<IReadiumNGViewSettingProps, IReadiumNGViewerSettingStates> {

  constructor(props: IReadiumNGViewSettingProps) {
    super(props);
    this.state = { pageWidth: 400, fontSize: 100 };
    this.saveViewSetting = this.saveViewSetting.bind(this);
    this.savePageWidth = this.savePageWidth.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

    this.props.rendition.setPageSize(this.state.pageWidth, 800);

    this.props.rendition.viewport.renderAtOffset(0);
  }

}
