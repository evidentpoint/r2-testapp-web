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
  private style : any = {
    margin: '5px',
  };

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
      <div style={ { width: 'fit-content' } }>
        <div style={ { margin: '5 10px', display: 'inline-block' } }>
        <TextField type="text" name="pageWidth" floatingLabelText="Page Width" value={ this.state.pageWidth }
                 onChange={ this.handleChange } />
        <RaisedButton style={ this.style } onClick={ this.savePageWidth }>Update</RaisedButton>
        </div>
        <div style={ { margin: '5 10px', display: 'inline-block' } }>
        <TextField type="text" name="fontSize" floatingLabelText="Font Size" value={ this.state.fontSize }
                 onChange={ this.handleChange } />
        <RaisedButton style={ this.style } onClick={ this.saveViewSetting }>Update</RaisedButton>
        </div>
        <RaisedButton style={ this.style } onClick={ this.toggleScrolling }>Toggle Scrolling</RaisedButton>
        <RaisedButton style={ this.style } onClick={ this.toggleViewAsVertical }>Toggle View as Vertical</RaisedButton>
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
    this.setState({ enableScroll: !scrollVal });
    this.props.rendition.viewport.enableScroll(this.state.enableScroll);

    this.props.rendition.viewport.renderAtOffset(0);
  }

  private toggleViewAsVertical(): void {
    if (!this.props.rendition) {
      return;
    }

    const currentVal = this.state.viewAsVertical;
    console.log(currentVal);
    this.setState({ viewAsVertical: !currentVal });
    console.log(this.state.viewAsVertical);
    this.props.rendition.setViewAsVertical(this.state.viewAsVertical);
    console.log(this.state.viewAsVertical);

    this.props.rendition.viewport.renderAtOffset(0);
  }
}
