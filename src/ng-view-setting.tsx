import React, { ReactNode } from 'react';

import {
  Navigator,
  Rendition,
  SettingName,
  SpreadMode,
  stringToSettingName,
} from '@evidentpoint/r2-navigator-web';

export interface IReadiumNGViewSettingProps {
  rendition: Rendition | null;
  navigator: Navigator | null;
}

export interface IReadiumNGViewerSettingStates {
  pageWidth: number;
  viewSetting: SettingName;
  viewSettingValue: string;
}

export class ReadiumNGViewSetting extends
  React.Component<IReadiumNGViewSettingProps, IReadiumNGViewerSettingStates> {

  constructor(props: IReadiumNGViewSettingProps) {
    super(props);
    this.state = { pageWidth: 400, viewSetting: SettingName.FontSize, viewSettingValue: '100' };
    this.saveViewSetting = this.saveViewSetting.bind(this);
    this.savePageWidth = this.savePageWidth.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleViewSettingOptionChange = this.handleViewSettingOptionChange.bind(this);
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
          View Settings:
          <select value={ this.state.viewSetting } onChange={ this.handleViewSettingOptionChange }>
            <option value={ SettingName.BackgroundColor } aria-selected="false">
              { SettingName.BackgroundColor }
            </option>
            <option value={ SettingName.ColumnGap } aria-selected="false">
              { SettingName.ColumnGap }
            </option>
            <option value={ SettingName.FontFamily } aria-selected="false">
              { SettingName.FontFamily }
            </option>
            <option value={ SettingName.FontSize } aria-selected="true">
              { SettingName.FontSize }
            </option>
            <option value={ SettingName.ReadingMode } aria-selected="false">
              { SettingName.ReadingMode }
            </option>
            <option value={ SettingName.SpreadMode } aria-selected="false">
              { SettingName.SpreadMode }
            </option>
            <option value={ SettingName.TextColor } aria-selected="false">
              { SettingName.TextColor }
            </option>
          </select>
          <input type="text" name="settingValue" value={ this.state.viewSettingValue }
                 onChange={ this.handleChange } />
        </label>
        <button onClick={ this.saveViewSetting }>Update</button>
      </div>
    );
  }

  private handleChange(event: React.FormEvent<HTMLInputElement>): void {
    const elementName = event.currentTarget.name;
    if (elementName === 'pageWidth') {
      const newVal = parseInt(event.currentTarget.value, 10);
      if (isNaN(newVal)) {
        return;
      }
      this.setState({ pageWidth: newVal });
    } else if (elementName === 'settingValue') {
      this.setState({ viewSettingValue: event.currentTarget.value });
    }
  }

  private handleViewSettingOptionChange(event: React.FormEvent<HTMLSelectElement>): void {
    const setting = stringToSettingName(event.currentTarget.value);
    if (!setting) {
      console.error(`Unknown setting: ${event.currentTarget.value}`);

      return;
    }

    this.setState({ viewSetting:  setting });
  }

  private async saveViewSetting(): Promise<void> {
    if (!this.props.rendition) {
      return;
    }

    let settingValue: number | string = this.state.viewSettingValue;
    if (this.state.viewSetting === SettingName.ColumnGap) {
      settingValue = parseFloat(settingValue);
    }

    const newSetting = { name: this.state.viewSetting, value: settingValue };
    this.props.rendition.updateViewSettings([newSetting]);

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

}
