import * as React from "react";
import Carousel from "nuka-carousel";
import { useState, useEffect } from "react";
import { useId, useBoolean } from "@fluentui/react-hooks";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { hiddenContentStyle, mergeStyles } from "@fluentui/react/lib/Styling";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import styles from "./ItTicketing.module.scss";
import { Icon } from "@fluentui/react/lib/Icon";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption,
} from "@fluentui/react/lib/Dropdown";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

const dialogStyles = { main: { maxWidth: 450 } };

function groupArr(data, n) {
  var group = [];
  for (var i = 0, j = 0; i < data.length; i++) {
    if (i >= n && i % n === 0) j++;
    group[j] = group[j] || [];
    group[j].push(data[i]);
  }
  return group;
}
const ApprovalCarousel = (props) => {
  const [groupedItems, setGroupedItems] = useState([]);
  const [defaultOption, setDefaultOption] = useState(0);
  const [ddOptions, setDdOptions] = useState([]);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const labelId: string = useId("dialogLabel");
  const subTextId: string = useId("subTextLabel");
  useEffect(() => {
    props.spcontext.web.lists
      .getByTitle("Tickets")
      .items.select("*,Status/Title,Status/ID")
      .expand("Status              ")
      .orderBy("Created", false)
      .get()
      .then(async (listData) => {
        await props.spcontext.web.lists
          .getByTitle("DropdownStatus")
          .items.get()
          .then((listItem) => {
            console.log(listItem);
            setDdOptions(listItem);
          });
        setGroupedItems(groupArr(listData, 3));
      });
  }, []);
  console.log(groupedItems);
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
    }),
    [labelId, subTextId]
  );
  const options: IDropdownOption[] = ddOptions.map((option) => {
    return {
      key: option.ID,
      text: option.Title,
    };
  });
  console.log(options);

  return (
    <Carousel
      defaultControlsConfig={{
        pagingDotsStyle: {
          display: "none",
        },
      }}
      renderCenterLeftControls={({ previousSlide }) => (
        <Icon
          onClick={previousSlide}
          iconName="ChevronLeft"
          style={{ fontSize: "1.3rem", cursor: "pointer" }}
        />
      )}
      renderCenterRightControls={({ nextSlide }) => (
        <Icon
          onClick={nextSlide}
          iconName="ChevronRight"
          style={{ fontSize: "1.3rem", cursor: "pointer" }}
        />
      )}
    >
      {groupedItems.length > 0 &&
        groupedItems.map((liItems) => {
          return (
            <div>
              {liItems.map((liItem) => {
                return (
                  <div className={styles.carouselItem}>
                    <div className={styles.carouselTitle}>{liItem.Title}</div>
                    <div className="carouselIcon">
                      <Icon
                        onClick={() => {
                          toggleHideDialog();
                          setDefaultOption(liItem.Status.ID);
                          console.log(defaultOption);
                        }}
                        iconName="Edit"
                        className={`${liItem.ID}`}
                        style={{ fontSize: "1.3rem", color: "#24299b" }}
                      />
                    </div>
                  </div>
                );
              })}

              <Dialog
                hidden={hideDialog}
                onDismiss={toggleHideDialog}
                // dialogContentProps={dialogContentProps}
                modalProps={modalProps}
              >
                <Dropdown
                  placeholder="Select an option"
                  label="Status"
                  options={options}
                  styles={dropdownStyles}
                  defaultSelectedKey={defaultOption}
                />
                <DialogFooter>
                  <PrimaryButton onClick={toggleHideDialog} text="Ok" />
                  <DefaultButton onClick={toggleHideDialog} text="Cancel" />
                </DialogFooter>
              </Dialog>
            </div>
          );
        })}
    </Carousel>
  );
};
export default ApprovalCarousel;
