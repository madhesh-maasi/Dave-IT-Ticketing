import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "ItTicketingWebPartStrings";
import ItTicketing from "./components/ItTicketing";
import { IItTicketingProps } from "./components/IItTicketingProps";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { graph } from "@pnp/graph/presets/all";

export interface IItTicketingWebPartProps {
  description: string;
  context: string;
}

export default class ItTicketingWebPart extends BaseClientSideWebPart<IItTicketingWebPartProps> {
  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      graph.setup({
        spfxContext: this.context,
      });

      sp.setup({
        spfxContext: this.context,
      });
    });
  }
  public render(): void {
    const element: React.ReactElement<IItTicketingProps> = React.createElement(
      ItTicketing,
      {
        description: this.properties.description,
        context: this.context,
        graphcontext: graph,
        spcontext: sp,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
