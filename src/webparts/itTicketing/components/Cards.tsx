import * as React from "react";
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardStyles,
  IDocumentCardTitleStyles,
  IDocumentCardPreviewProps,
  IDocumentCardLogoProps,
  DocumentCardLogo,
} from "@fluentui/react/lib/DocumentCard";
import { FontSizes, NeutralColors, Depths } from "@fluentui/theme";
import "./Cards.css";
import styles from "./ItTicketing.module.scss";
import "office-ui-fabric-react/dist/css/fabric.css";

const iconLearnProps: IDocumentCardLogoProps = {
  logoIcon: "ReadingModeSolid",
};

const iconOrderProps: IDocumentCardLogoProps = {
  logoIcon: "ActivateOrders",
};

const iconGetHelpProps: IDocumentCardLogoProps = {
  logoIcon: "CRMCustomerInsightsApp",
};
const iconGiveFeedbackProps: IDocumentCardLogoProps = {
  logoIcon: "Feedback",
};
const cardStyles: IDocumentCardStyles = {
  root: {
    maxWidth: "100%",
    backgroundColor: "#2A3246",
    border: "0",
    // borderTopLeftRadius: ".5rem",
    // borderBottomLeftRadius: ".5rem",
    padding: ".2rem",
    boxShadow: "-2px 1px 10px 0px #c9c9c9c9",
  },
};
const cardPrimaryTitleStyles: IDocumentCardTitleStyles = {
  root: {
    color: "#fff",
    height: "auto",
    fontSize: "18px",
  },
};
const cardSecondaryTitleStyles: IDocumentCardTitleStyles = {
  root: {
    color: "#fff",
    fontWeight: "lighter",
    fontSize: "14px",
  },
};
const iconColor = {
  root: {
    color: "#E2824A",
  },
};
const Cards = (props) => {
  return (
    <div className={styles.cardSection}>
      {/* Card Item 1 */}
      <div className={styles.cardItem}>
        {/* <DocumentCard onClickHref="http://bing.com" onClickTarget="_blank"> */}
        <DocumentCard styles={cardStyles}>
          <DocumentCardLogo {...iconLearnProps} styles={iconColor} />
          <DocumentCardTitle styles={cardPrimaryTitleStyles} title={"Learn"} />
          <DocumentCardTitle
            styles={cardSecondaryTitleStyles}
            title={
              "This will redirect you to the Intranet/Learning Training SharePoint site"
            }
            shouldTruncate
            showAsSecondaryTitle
          />
        </DocumentCard>
        <div className={styles.cardRightBorder}></div>
      </div>
      {/* Card 2 */}
      <div className={styles.cardItem}>
        {/* <DocumentCard onClickHref="http://bing.com" onClickTarget="_blank"> */}
        <DocumentCard styles={cardStyles}>
          <DocumentCardLogo {...iconOrderProps} styles={iconColor} />
          <DocumentCardTitle styles={cardPrimaryTitleStyles} title={"Order"} />
          <DocumentCardTitle
            styles={cardSecondaryTitleStyles}
            title={
              "This will redirect you to the Intranet/Learning Training SharePoint site"
            }
            shouldTruncate
            showAsSecondaryTitle
          />
        </DocumentCard>
        <div className={styles.cardRightBorder}></div>
      </div>
      {/* Card 3 */}
      <div className={styles.cardItem}>
        {/* <DocumentCard onClickHref="http://bing.com" onClickTarget="_blank"> */}
        <DocumentCard
          styles={cardStyles}
          onClick={() => {
            window.open(
              "https://apps.powerapps.com/play/b56dc6c4-2c47-4ebc-8119-847ee0b618b8?tenantId=3e8e53be-a48f-4147-adf8-7e90a6e46b57",
              "_blank"
            );
          }}
        >
          <DocumentCardLogo {...iconGetHelpProps} styles={iconColor} />
          <DocumentCardTitle
            styles={cardPrimaryTitleStyles}
            title={"Get Help"}
          />
          <DocumentCardTitle
            styles={cardSecondaryTitleStyles}
            title={
              "This will redirect you to the Intranet/Learning Training SharePoint site"
            }
            shouldTruncate
            showAsSecondaryTitle
          />
        </DocumentCard>
        <div className={styles.cardRightBorder}></div>
      </div>
      {/* Card 4 */}
      <div className={styles.cardItem}>
        {/* <DocumentCard onClickHref="http://bing.com" onClickTarget="_blank"> */}
        <DocumentCard styles={cardStyles}>
          <DocumentCardLogo {...iconGiveFeedbackProps} styles={iconColor} />
          <DocumentCardTitle
            styles={cardPrimaryTitleStyles}
            title={"Give Feedback"}
          />
          <DocumentCardTitle
            styles={cardSecondaryTitleStyles}
            title={
              "This will redirect you to the Intranet/Learning Training SharePoint site"
            }
            shouldTruncate
            showAsSecondaryTitle
          />
        </DocumentCard>
        <div className={styles.cardRightBorder}></div>
      </div>
      {/* ---- Card Section ---- */}
    </div>
  );
};
export default Cards;
