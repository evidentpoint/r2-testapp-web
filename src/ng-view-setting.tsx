import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import React, { ReactNode } from 'react';

import { Rendition } from 'readium-ng';

export interface IReadiumNGViewSettingProps {
  rendition: Rendition | null;
}

export interface IReadiumNGViewerSettingStates {
  pageWidth: number;
  fontSize: number;
  enableScroll: boolean;
  viewAsVertical: boolean;
}

export class ReadiumNGViewSetting extends
  React.Component<IReadiumNGViewSettingProps, IReadiumNGViewerSettingStates> {

  constructor(props: IReadiumNGViewSettingProps) {
    super(props);
    this.state = { pageWidth: 400, fontSize: 100, enableScroll: true, viewAsVertical: false };
    this.saveViewSetting = this.saveViewSetting.bind(this);
    this.savePageWidth = this.savePageWidth.bind(this);
    this.toggleScrolling = this.toggleScrolling.bind(this);
    this.toggleViewAsVertical = this.toggleViewAsVertical.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public render(): ReactNode {
    return (
      <div style={ { width: 'auto', margin: '2px', 'box-shadow': '0 7px 6px -3px #dedede' } } className="settings-container">
        <div style={ { display: 'inline-block' } } className="text-field-container">
        <TextField type="text" name="pageWidth" floatingLabelText="Page Width" value={ this.state.pageWidth }
                 onChange={ this.handleChange } className="setting-text-field" />
        <RaisedButton onClick={ this.savePageWidth } className="settings-button">Update</RaisedButton>
        </div>
        <div style={ { display: 'inline-block' } } className="text-field-container">
        <TextField type="text" name="fontSize" floatingLabelText="Font Size" value={ this.state.fontSize }
                 onChange={ this.handleChange } className="setting-text-field" />
        <RaisedButton onClick={ this.saveViewSetting } className="settings-button">Update</RaisedButton>
        </div>
        <RaisedButton style={ { float: 'right', display: 'inline-block' } }
                      onClick={ this.toggleScrolling } className="settings-button scrolling-button">Toggle Scrolling</RaisedButton>
        <RaisedButton style={ { float: 'right', display: 'inline-block' } }
                      onClick={ this.toggleViewAsVertical } className="settings-button view-as-vertical-button">Toggle View as Vertical</RaisedButton>
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

  private toggleScrolling(): void {
    if (!this.props.rendition) {
      return;
    }

    const scrollVal = this.state.enableScroll;
    this.props.rendition.viewport.enableScroll(!scrollVal);
    this.setState({ enableScroll: !scrollVal });

    this.props.rendition.viewport.renderAtOffset(0);
  }

  private toggleViewAsVertical(): void {
    if (!this.props.rendition) {
      return;
    }

    const currentVal = this.state.viewAsVertical;
    this.props.rendition.setViewAsVertical(!currentVal);
    this.setState({ viewAsVertical: !currentVal });

    this.props.rendition.render();
    this.props.rendition.viewport.renderAtOffset(0);
  }
}
