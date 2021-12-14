import * as React from "react";
import styles from "./ItTicketing.module.scss";
import { IItTicketingProps } from "./IItTicketingProps";
import { escape } from "@microsoft/sp-lodash-subset";
import App from "./App";
import "./ItTicketing.css";
export default class ItTicketing extends React.Component<
  IItTicketingProps,
  {}
> {
  public render(): React.ReactElement<IItTicketingProps> {
    return (
      <App
        spcontext={this.props.spcontext}
        graphcontext={this.props.graphcontext}
      />
    );
  }
}
