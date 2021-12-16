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
import styles from "./Carousel.modul.scss";
const theme = getTheme();
const themeBoxShadow = { boxShadow: theme.effects.elevation8 };
let curUserMail = "";
const Tiles = (props) => {
  // fetch(
  //   "https://chandrudemo.sharepoint.com/_api/search/query?querytext='ContentType:News*+path:https://chandrudemo.sharepoint.com/sites/ITTicketingSystems/'&selectproperties='Title,path,ViewsLifeTime,ViewsLifeTimeUniqueUsers'"
  // )
  //   .then((res) => res.json())
  //   .then((result) => {
  //     console.log(result);
  //   });

  const [closedIncident, setClosedIncident] = useState([]);
  const [openIncidents, setOpenIncidents] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [isUserInGroup, setIsUserInGroup] = useState(false);
  useEffect(() => {
    graph.me().then(async (userResult) => {
      setCurrentUser(userResult.displayName);
      curUserMail = userResult.userPrincipalName;
      await props.spcontext.web.lists
        .getByTitle("Tickets")
        .items.select("*,Owner/EMail,Owner/Title,Status/Title,AssignedTo/Title")
        .expand("Owner", "Status", "AssignedTo")
        .filter(`Owner/EMail eq '${curUserMail}'`)
        .orderBy("Created", false)
        .get()
        .then((listData) => {
          let arrClosedIncidents = listData.filter(
            (item) => item.Status.Title == "Closed"
          );
          let arrNonClosedIncidents = listData.filter(
            (item) => item.Status.Title != "Closed"
          );
          setClosedIncident(arrClosedIncidents);
          setOpenIncidents(arrNonClosedIncidents);
        })
        .then(async () => {
          await graph.groups
            .getById("b64fbcf5-8935-4882-9d67-f18d0e4a91d8")
            .expand("members")
            .get()
            .then((groupData) => {
              setIsUserInGroup(
                groupData.members.filter(
                  (member) => member["userPrincipalName"] == curUserMail
                ).length > 0
              );
            });
        });
    });
  }, []);

  return (
    <div className={classes.tilesSection}>
      {/* Tile Item */}
      {isUserInGroup && (
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
      )}
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
          <div className={classes.contentAlignment}>
            {closedIncident.length > 0 &&
              closedIncident.slice(0, 3).map((incident) => {
                return (
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{incident.Title}</span>
                    <span style={{ fontWeight: "normal" }}>
                      {`by: ${incident.AssignedTo.Title}`}
                    </span>
                  </p>
                );
              })}
          </div>
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
          <div className={classes.contentAlignment}>
            <p>Idea001 - New Assignment Portal Requesting</p>
            <p>Idea001 - New Assignment Portal Requesting</p>
            <p>Idea001 - New Assignment Portal Requesting</p>
          </div>
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
          <div className={classes.contentAlignment}>
            {openIncidents.length > 0 &&
              openIncidents.slice(0, 3).map((incident) => {
                return (
                  <div className={classes.incidentStatus}>
                    <div className={classes.incidentLabel}>
                      <p>
                        {incident.Title} -{" "}
                        <span style={{ fontWeight: "normal" }}>
                          {incident.Status.Title}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
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
          <div className={classes.contentAlignment}>
            <p>Idea001 - New Assignment</p>
            <p>Idea001 - New Assignment</p>
            <p>Idea001 - New Assignment</p>
          </div>
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
