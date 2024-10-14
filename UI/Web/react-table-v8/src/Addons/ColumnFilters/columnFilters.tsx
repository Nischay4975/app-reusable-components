import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Popover,
  Box,
  Paper,
  IconButton,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Autocomplete,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { columnDataType } from "../../baseReactTableV8";
import "./columnFilters.scss";

type propTypes = {
  column: columnDataType;
};

//Number Type Handling. Use of base HTML input element requires this to be defined outside main FC

type NumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  value?: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
};

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value); // Convert the input to a number
    if (!isNaN(newValue)) {
      onChange(newValue); // Call the onChange function with the number value
    }
  };

  return (
    <input
      {...rest}
      type="number" // Restrict input type to number
      value={value}
      name="Min"
      min={min}
      max={max}
      onChange={handleChange}
    />
  );
};

const FilterColumns: React.FC<propTypes> = ({ column }) => {
  const { filterVariant } = column.columnDef.meta ?? {};
  const [columnVisibililtyAnchorEl, setColumnVisibililtyAnchorEl] =
    useState<null | HTMLElement>(null);

  const columnFilterValue = column.getFilterValue();
  const [filterValue, setFilterValue] = useState<any>();

  useEffect(() => {
    setFilterValue(columnFilterValue);
  }, []);

  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues(), filterVariant]
  );

  const handleColumnVisiblePopoverOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    console.log("unique", sortedUniqueValues);
    setColumnVisibililtyAnchorEl(
      columnVisibililtyAnchorEl ? null : event.currentTarget
    );
  };

  const handleColumnVisiblePopoverClose = () => {
    setColumnVisibililtyAnchorEl(null);
  };

  const handleApply = () => {
    column.setFilterValue(filterValue);
  };

  const handleReset = () => {
    column.setFilterValue(null);
    setFilterValue("");
  };

  //Bool Type Handling

  const handleBoolChange = (e: any) => {
    if (e.target.value === "true") {
      setFilterValue(true);
    } else {
      setFilterValue(false);
    }
  };

  const renderFilter = (str: string) => {
    switch (str) {
      case "string": {
        return (
          <Autocomplete
            size="small"
            className="column-data-string-filter"
            options={sortedUniqueValues}
            value={filterValue}
            onChange={(e, newValue) => setFilterValue(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter"
                placeholder="Enter Filter"
                variant="outlined"
              />
            )}
          />
        );
      }
      case "boolean": {
        return (
          <div>
            <FormControl>
              <FormLabel>Select</FormLabel>
              <RadioGroup
                value={filterValue}
                onChange={(e) => handleBoolChange(e)}
              >
                <FormControlLabel
                  value={"true"}
                  control={<Radio />}
                  label={"True"}
                />
                <FormControlLabel
                  value={"false"}
                  control={<Radio />}
                  label={"False"}
                />
              </RadioGroup>
            </FormControl>
          </div>
        );
      }
      case "number": {
        return (
          <div className="number-filter-container">
            <NumberInput
              min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
              max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
              value={(filterValue as [number, number])?.[0] ?? ""}
              onChange={(value) =>
                setFilterValue((old: [number, number]) => [value, old?.[1]])
              }
              placeholder={`  ${
                column.getFacetedMinMaxValues()?.[0] !== undefined
                  ? `Min: ${column.getFacetedMinMaxValues()?.[0]}`
                  : ""
              }`}
              style={{ minWidth: "100px" }}
              className="column-data-number-filter"
            />
            <div>to</div>
            <NumberInput
              min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
              max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
              value={(filterValue as [number, number])?.[1] ?? ""}
              onChange={(value) =>
                setFilterValue((old: [number, number]) => [old?.[0], value])
              }
              placeholder={`  ${
                column.getFacetedMinMaxValues()?.[0] !== undefined
                  ? `Max: ${column.getFacetedMinMaxValues()?.[1]}`
                  : ""
              }`}
              style={{ minWidth: "100px" }}
              className="column-data-number-filter"
            />
          </div>
        );
      }
    }
  };

  const columnVisibleOpenState = Boolean(columnVisibililtyAnchorEl);
  const columnVisbileId = columnVisibleOpenState ? "simple-popover" : undefined;

  return (
    <>
      <div className="table-visible-columns" style={{ width: "fit-content" }}>
        <IconButton
          aria-describedby={columnVisbileId}
          onClick={handleColumnVisiblePopoverOpen}
        >
          <FilterAltIcon
            className={`cursor-pointer ${
              column.getIsFiltered() ? "filter-active" : "filter-inactive"
            }`}
            style={{
              transform: `scaleX(0.8)`,
            }}
          />
        </IconButton>
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
          <Box sx={{ bgcolor: "background.paper", minWidth: "250px" }}>
            <Paper sx={{ padding: "20px" }}>
              <div className="filter-block">{renderFilter(filterVariant)}</div>
              <div className="button-block">
                <Button variant="contained" onClick={handleApply}>
                  Apply
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </Paper>
          </Box>
        </Popover>
      </div>
    </>
  );
};

export default FilterColumns;
