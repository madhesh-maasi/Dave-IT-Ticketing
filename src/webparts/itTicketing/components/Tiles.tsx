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
//import { IWebPartContext } from '@microsoft/sp-client-preview'; // Old dcumentation refers to this.
const theme = getTheme();
const themeBoxShadow = { boxShadow: theme.effects.elevation8 };
let curUserMail = "";
let url = window.location.href;
// console.log(`https://${window.location.href.split("/")[4]`);

let siteAbsoluteUrl = `https://${window.location.href.split("/")[2]}`;
let siteUrl = `https://${window.location.href.split("/")[2]}/sites/${
  window.location.href.split("/")[4]
}`;
console.log(siteUrl);

const Tiles = (props) => {
  const [closedIncident, setClosedIncident] = useState([]);
  const [openIncidents, setOpenIncidents] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [isUserInGroup, setIsUserInGroup] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [popularPages, setPopularPages] = useState([]);
  const [reRender, setReRender] = useState(true);
  useEffect(() => {
    if (reRender) {
      graph
        .me()
        .then(async (userResult) => {
          setCurrentUser(userResult.displayName);
          curUserMail = userResult.userPrincipalName;
          await props.spcontext.web.lists
            .getByTitle("Tickets")
            .items.select(
              "*,Owner/EMail,Owner/Title,Status/Title,AssignedTo/Title,AssignedTo/EMail"
            )
            .expand("Owner", "Status", "AssignedTo")
            .filter(`Owner/EMail eq '${curUserMail}'`)
            .orderBy("Modified", false)
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
        })
        .then(async () => {
          await props.spcontext.web.lists
            .getByTitle("Feedback")
            .items.orderBy("Created", false)
            .get()
            .then((feedbackList: any) => {
              setFeedback(feedbackList);
            });
          try {
            await props.spcontext.web.lists
              .getByTitle("Site Pages")
              .items.orderBy("Created", false)
              .getAll()
              .then((pages: any) => {
                console.log(pages);

                pages = pages.filter((page) => page.isPopular == true);
                setPopularPages(pages);
              });
          } catch (error) {
            console.log(error);
          }
        });
    }
    setReRender(false);
  }, [reRender]);
  const renderHandler = () => {
    setReRender(true);
  };
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
            <ApprovalCarousel
              spcontext={props.spcontext}
              onStatusChangeHandler={renderHandler}
            />
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
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "normal",
                      }}
                    >
                      {incident.AssignedTo ? (
                        <>
                          <span className={classes.closedIncidInit}>
                            {`${incident.AssignedTo.Title.split(" ")[0]
                              .split("")[0]
                              .toUpperCase()}${incident.AssignedTo.Title.split(
                              " "
                            )[1]
                              .split("")[0]
                              .toUpperCase()}`}
                          </span>
                          <img
                            className={classes.closedImg}
                            src={getMyPictureUrl(
                              siteAbsoluteUrl,
                              incident.AssignedTo.EMail,
                              "S"
                            )}
                            alt={incident.AssignedTo.EMail}
                          />
                        </>
                      ) : (
                        ""
                      )}
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
              style={themeBoxShadow}
              onClick={() => {
                props.onViewAllClicked("ClosedIncidents");
                // window.open(
                //   `https://chandrudemo.sharepoint.com/sites/ITTicketingSystems/Lists/Tickets/AllItems.aspx?FilterField1=Owner&FilterValue1=${currentUser}&FilterType1=User&FilterField2=Status&FilterValue2=Closed&FilterType2=Lookup&viewid=ba37e88d%2D9062%2D4b05%2D82ec%2D11544a45f6a8`,
                //   "_blank"
                // );
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
            {popularPages.slice(0, 3).map((page) => {
              return (
                <p>
                  <a
                    href={`${siteUrl}/SitePages/${page.Title}.aspx`}
                    target="_blank"
                  >
                    {page.Title}
                  </a>
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
              style={themeBoxShadow}
              onClick={() => {
                props.onViewAllClicked("PopularPage");
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
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span>{incident.Title} -</span>{" "}
                        <span
                          style={{
                            padding: "0 0.3rem",
                            fontWeight: "normal",
                            border:
                              incident.Status.Title == "New"
                                ? "2px solid #2844a7"
                                : incident.Status.Title == "Closed"
                                ? "2px solid #28a745"
                                : incident.Status.Title ==
                                  "Escalated to Presidio"
                                ? "2px solid #dc3545"
                                : incident.Status.Title == "In progress"
                                ? "2px solid #a728a3"
                                : incident.Status.Title == "On hold"
                                ? "2px solid #a3a728"
                                : "2px solid #000",
                            color:
                              incident.Status.Title == "New"
                                ? "#2844a7"
                                : incident.Status.Title == "Closed"
                                ? "#28a745"
                                : incident.Status.Title ==
                                  "Escalated to Presidio"
                                ? "#dc3545"
                                : incident.Status.Title == "In progress"
                                ? "#a728a3"
                                : incident.Status.Title == "On hold"
                                ? "#a3a728"
                                : "#000",
                          }}
                        >
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
            <a
              href="#"
              className={classes.viewAll}
              style={themeBoxShadow}
              onClick={() => {
                props.onViewAllClicked("CurrentIncidents");
              }}
            >
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
            {feedback.slice(0, 3).map((fBack) => {
              return <p>{fBack.Title}</p>;
            })}
          </div>
        </div>
        <div className={classes.tileFooter}>
          <div className={classes.buttonSection}>
            <a
              href="#"
              className={classes.viewAll}
              style={themeBoxShadow}
              onClick={() => {
                props.onViewAllClicked("MyFeedBacks");
              }}
            >
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
const getMyPictureUrl = (webUrl, accountName, size) => {
  return (
    webUrl +
    "/_layouts/15/userphoto.aspx?size=" +
    size +
    "&accountname=" +
    accountName
  );
};
export default Tiles;
