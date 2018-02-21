import React, { ReactNode } from 'react';

import { Rendition } from 'readium-ng';

export interface IReadiumNGViewSettingProps {
  rendition: Rendition | null;
}

export interface IReadiumNGViewerSettingStates {
  pageWidth: number;
}

export class ReadiumNGViewSetting extends
  React.Component<IReadiumNGViewSettingProps, IReadiumNGViewerSettingStates> {

  constructor(props: IReadiumNGViewSettingProps) {
    super(props);
    this.state = { pageWidth: 400 };
    this.saveViewSetting = this.saveViewSetting.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public render(): ReactNode {
    return (
      <div>
        <label>
          Page Width:
          <input type="text" value={ this.state.pageWidth } onChange={ this.handleChange } />
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

    this.setState({ pageWidth: newVal });
  }

  private saveViewSetting(): void {
    if (!this.props.rendition) {
      return;
    }

    this.props.rendition.setPageSize(this.state.pageWidth, 800);
    this.props.rendition.viewport.renderAtOffset(0);
  }

}
