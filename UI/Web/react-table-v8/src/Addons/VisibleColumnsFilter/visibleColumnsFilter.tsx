import React from "react";
import { useState } from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Popover,
    Box,
    Paper
} from "@mui/material";


import { columnDataType } from "../../baseReactTableV8";




const HideColumns:React.FC<any> = (props:any) => {
    const [columnVisibililtyAnchorEl, setColumnVisibililtyAnchorEl] = useState<null | HTMLElement>(null);
    const {table} = props

    const isColumnVisible = (column: columnDataType): boolean => {
        const leafSubcolumnsArr = column.getLeafColumns();
        return leafSubcolumnsArr.reduce(
          (acc: boolean, obj: columnDataType) => acc && obj.getIsVisible(),
          true
        );
      };
    
      const isColumnIndeterminate = (column: columnDataType): boolean => {
        return column.getIsVisible() !== isColumnVisible(column);
      };
    
      const toggleColumnVisibility = (column: columnDataType): void => {
        const leafSubcolumnsArr = column.getLeafColumns();
        if (isColumnVisible(column) || isColumnIndeterminate(column)) {
          leafSubcolumnsArr.forEach((obj: columnDataType) =>
            obj.toggleVisibility(false)
          );
        } else {
          leafSubcolumnsArr.forEach((obj: columnDataType) =>
            obj.toggleVisibility(true)
          );
        }
      };
    
      const handleColumnVisiblePopoverOpen = (
        event: React.MouseEvent<HTMLElement>
      ) => {
        setColumnVisibililtyAnchorEl(
          columnVisibililtyAnchorEl ? null : event.currentTarget
        );
      };
    
      const handleColumnVisiblePopoverClose = () => {
        setColumnVisibililtyAnchorEl(null);
      };
    
      const columnVisibleOpenState = Boolean(columnVisibililtyAnchorEl);
      const columnVisbileId = columnVisibleOpenState ? "simple-popover" : undefined;

    return (
        <>
        <div className="table-visible-columns" style={{width:'fit-content'}}>
            <Button
              variant="contained"
              aria-describedby={columnVisbileId}
              onClick={handleColumnVisiblePopoverOpen}
            >
              Show / Hide Columns
            </Button>
            <Popover
              id={columnVisbileId}
              open={columnVisibleOpenState}
              anchorEl={columnVisibililtyAnchorEl}
              onClose={handleColumnVisiblePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Box sx={{ bgcolor: "background.paper", minWidth: "200px" }}>
                <Paper sx={{ padding: "10px" }}>
                  <div className="header-filter-container">
                    <div className="select-all">
                      <Button
                        variant="outlined"
                        onClick={table.getToggleAllColumnsVisibilityHandler()}
                      >
                        {table.getIsAllColumnsVisible()
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>
                    {table.getAllFlatColumns().map((column: columnDataType) => {
                      return (
                        <div
                          key={column.id}
                          className="px-1"
                          style={{ marginLeft: `${column.depth * 20}px` }}
                        >
                          <FormControlLabel
                            label={column.id}
                            control={
                              <Checkbox
                                checked={isColumnVisible(column)}
                                indeterminate={isColumnIndeterminate(column)}
                                onChange={() => toggleColumnVisibility(column)}
                              />
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </Paper>
              </Box>
            </Popover>
          </div>
        </>
    )
}

export default HideColumns;