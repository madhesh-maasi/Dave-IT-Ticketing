import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import classes from "./ItTicketing.module.scss";
import { Depths } from "@fluentui/theme";
import { getTheme } from "@fluentui/react";
import "office-ui-fabric-react/dist/css/fabric.css";
import { Icon } from "@fluentui/react/lib/Icon";
import { useState, useEffect } from "react";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { graph } from "@pnp/graph/presets/all";
import ApprovalCarousel from "./ApprovalCarousel";
const theme = getTheme();
const themeBoxShadow = { boxShadow: theme.effects.elevation8 };

const Tiles = (props) => {
  const [closedIncident, setClosedIncident] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  useEffect(() => {
    graph.me().then(async (userResult) => {
      setCurrentUser(userResult.displayName);
      await props.spcontext.web.lists
        .getByTitle("Tickets")
        .items.select("*,Owner/EMail,Owner/Title,Status/Title")
        .expand("Owner", "Status")
        .filter(
          `Owner/Title eq '${userResult.displayName}' and Status/Title eq 'Closed'`
        )
        .orderBy("Created", false)
        .get()
        .then((listData) => {
          setClosedIncident(listData);
        });
    });
  }, []);

  return (
    <div className={classes.tilesSection}>
      {/* Tile Item */}
      <div
        className={`${classes.tileItem} ${classes.myApproval}`}
        style={themeBoxShadow}
      >
        <div className={classes.tileHeader}>
          <div className={classes.tileHeaderLeft}>
            <Icon
              iconName="AzureKeyVault"
              style={{ marginRight: "0.5rem", fontSize: "1.2rem" }}
            />
            <div className={classes.tileTitle}>My Approvals</div>
          </div>
          <div className={classes.tileHeaderRight}></div>
        </div>
        <div className={`${classes.tileContent} ${classes.tileOne}`}>
          <ApprovalCarousel spcontext={props.spcontext} />
        </div>
      </div>
      {/* Tile Item */}
      <div
        className={`${classes.tileItem} ${classes.myApproval}`}
        style={themeBoxShadow}
      >
        <div className={classes.tileHeader}>
          <div className={classes.tileHeaderLeft}>
            <Icon
              iconName="Accept"
              style={{ marginRight: "0.5rem", fontSize: "1.2rem" }}
            />
            <div className={classes.tileTitle}>Closed Incidents</div>
          </div>
          <div className={classes.tileHeaderRight}></div>
        </div>
        <div className={classes.tileContent}>
          {closedIncident.length > 0 &&
            closedIncident.slice(0, 3).map((incident) => {
              return <p>{incident.Title}</p>;
            })}
        </div>
        <div className={classes.tileFooter}>
          <div className={classes.buttonSection}>
            <a
              href="#"
              className={classes.viewAll}
              onClick={() => {
                window.open(
                  `https://chandrudemo.sharepoint.com/sites/ITTicketingSystems/Lists/Tickets/AllItems.aspx?FilterField1=Owner&FilterValue1=${currentUser}&FilterType1=User&FilterField2=Status&FilterValue2=Closed&FilterType2=Lookup&viewid=ba37e88d%2D9062%2D4b05%2D82ec%2D11544a45f6a8`,
                  "_blank"
                );
              }}
            >
              View All
              <Icon iconName="ChevronRight" className={classes.viewAllIcon} />
            </a>
          </div>
        </div>
      </div>
      {/* Tile Item */}
      <div
        className={`${classes.tileItem} ${classes.myApproval}`}
        style={themeBoxShadow}
      >
        <div className={classes.tileHeader}>
          <div className={classes.tileHeaderLeft}>
            <Icon
              iconName="CRMReport"
              style={{ marginRight: "0.5rem", fontSize: "1.2rem" }}
            />
            <div className={classes.tileTitle}>Top KB Articles</div>
          </div>
          <div className={classes.tileHeaderRight}></div>
        </div>
        <div className={classes.tileContent}>
          <p>Idea001 - New Assignment Portal Requesting Dean</p>
          <p>Idea001 - New Assignment Portal Requesting Dean</p>
          <p>Idea001 - New Assignment Portal Requesting Dean</p>
        </div>
        <div className={classes.tileFooter}>
          <div className={classes.buttonSection}>
            <a href="#" className={classes.viewAll}>
              View All
              <Icon iconName="ChevronRight" className={classes.viewAllIcon} />
            </a>
          </div>
        </div>
      </div>
      {/* Tile Item */}
      <div
        className={`${classes.tileItem} ${classes.myApproval}`}
        style={themeBoxShadow}
      >
        <div className={classes.tileHeader}>
          <div className={classes.tileHeaderLeft}>
            <Icon
              iconName="SyncStatusSolid"
              style={{ marginRight: "0.5rem", fontSize: "1.2rem" }}
            />
            <div className={classes.tileTitle}>Current Incident Status</div>
          </div>
          <div className={classes.tileHeaderRight}></div>
        </div>
        <div className={classes.tileContent}>
          <div className={classes.incidentStatus}>
            <div className={classes.incidentLabel}>Outage - 2001123 </div>
            <div className={classes.incidentStatusIndication}>
              <div
                className={`${classes.indicationBar} ${classes.indicationRed}`}
              ></div>
            </div>
          </div>
          <div className={classes.incidentStatus}>
            <div className={classes.incidentLabel}>Outage - 2001124 </div>
            <div className={classes.incidentStatusIndication}>
              <div
                className={`${classes.indicationBar} ${classes.indicationRed}`}
              ></div>
            </div>
          </div>
          <div className={classes.incidentStatus}>
            <div className={classes.incidentLabel}>Solved - 2001125 </div>
            <div className={classes.incidentStatusIndication}>
              <div
                className={`${classes.indicationBar} ${classes.indicationGreen}`}
              ></div>
            </div>
          </div>
          <div className={classes.incidentStatus}>
            <div className={classes.incidentLabel}>Solved - 2001126 </div>
            <div className={classes.incidentStatusIndication}>
              <div
                className={`${classes.indicationBar} ${classes.indicationGreen}`}
              ></div>
            </div>
          </div>
        </div>
        <div className={classes.tileFooter}>
          <div className={classes.buttonSection}>
            <a href="#" className={classes.viewAll}>
              View All
              <Icon className={classes.viewAllIcon} iconName="ChevronRight" />
            </a>
          </div>
        </div>
      </div>
      {/* Tile Item */}
      <div
        className={`${classes.tileItem} ${classes.myApproval}`}
        style={themeBoxShadow}
      >
        <div className={classes.tileHeader}>
          <div className={classes.tileHeaderLeft}>
            <Icon
              iconName="FeedbackResponseSolid"
              style={{ marginRight: "0.5rem", fontSize: "1.2rem" }}
            />
            <div className={classes.tileTitle}>My Feedback</div>
          </div>
          <div className={classes.tileHeaderRight}></div>
        </div>
        <div className={classes.tileContent}>
          <p>Idea001 - New Assignment Portal Requesting Dean</p>

          <p>Idea001 - New Assignment Portal Requesting Dean</p>
          <p>Idea001 - New Assignment Portal Requesting Dean</p>
        </div>
        <div className={classes.tileFooter}>
          <div className={classes.buttonSection}>
            <a href="#" className={classes.viewAll}>
              View All
              <Icon iconName="ChevronRight" className={classes.viewAllIcon} />
            </a>
          </div>
        </div>
      </div>
      {/* Tile Item */}
    </div>
  );
};
export default Tiles;
