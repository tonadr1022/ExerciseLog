/* eslint-disable react/prop-types */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

const columnHelper = createColumnHelper();

const ExerciseTable3 = ({ tableData }) => {
  const [columnVisibility, setColumnVisibility] = useState({});

  const columns = useMemo(
    () => [
      columnHelper.group({
        header: "Main",
        columns: [
          columnHelper.accessor("name", {
            id: "name",
            cell: (info) => info.getValue(),
            header: () => "Name",
          }),
          columnHelper.accessor("act_type", {
            id: "act_type",
            cell: (info) => info.getValue(),
            header: () => "Form",
          }),
          columnHelper.accessor("workout_type", {
            id: "workout_type",
            cell: (info) => info.getValue(),
            header: () => "Type",
          }),
          columnHelper.accessor("location", {
            id: "location",
            cell: (info) => info.getValue()?.split(",")[0],
            header: () => "Location",
          }),
          columnHelper.accessor("shoe", {
            id: "shoe",
            cell: (info) => info.getValue(),
            header: () => "Shoe",
          }),
          columnHelper.accessor("formatted_date", {
            id: "formatted_date",
            cell: (info) => info.getValue(),
            header: () => "Date",
          }),
          columnHelper.accessor("formatted_time", {
            id: "formatted_time",
            cell: (info) => info.getValue(),
            header: () => "Time",
          }),
          columnHelper.accessor("duration", {
            id: "duration",
            cell: (info) => info.getValue(),
            header: () => "Duration",
          }),
          columnHelper.accessor("distance", {
            id: "distance",
            cell: (info) => info.getValue(),
            header: () => "Distance (mi)",
          }),
          columnHelper.accessor("pace", {
            id: "pace",
            cell: (info) => info.getValue(),
            header: () => "Pace (min/mi)",
          }),
          columnHelper.accessor("rating", {
            id: "rating",
            cell: (info) => info.getValue(),
            header: () => "Rating",
          }),

          columnHelper.accessor("average_heartrate", {
            id: "average_heartrate",
            cell: (info) => info.getValue(),
            header: () => "Avg HR",
          }),
          columnHelper.accessor("max_heartrate", {
            id: "max_heartrate",
            cell: (info) => info.getValue(),
            header: () => "Max HR",
          }),
          columnHelper.accessor("total_elevation_gain", {
            id: "total_elevation_gain",
            cell: (info) => info.getValue(),
            header: () => "Elev. Gain",
          }),
          columnHelper.accessor("calories", {
            id: "calories",
            cell: (info) => info.getValue(),
            header: () => "Calories",
          }),
        ],
      }),
      columnHelper.group({
        id: "weather",
        header: () => <span>Weather</span>,
        columns: [
          columnHelper.accessor((row) => row?.weather?.temperature, {
            id: "temperature",
            cell: (info) => info.getValue(),
            header: () => "Temperature",
          }),
          columnHelper.accessor((row) => row?.weather?.humidity, {
            id: "humidity",
            cell: (info) => info.getValue(),
            header: () => "Humidity",
          }),
          columnHelper.accessor((row) => row?.weather?.feels_like, {
            id: "feels_like",
            cell: (info) => info.getValue(),
            header: () => "Feels Like",
          }),
          columnHelper.accessor((row) => row?.weather?.wind_speed, {
            id: "wind_speed",
            cell: (info) => info.getValue(),
            header: () => "Wind (mph)",
          }),
          columnHelper.accessor((row) => row?.weather?.type, {
            id: "weather_type",
            cell: (info) => info.getValue(),
            header: () => "type",
          }),
          columnHelper.accessor(
            (row) => (row?.weather?.from_current_api ? "true" : "false"),
            {
              id: "from_current_api",
              cell: (info) => info.getValue(),
              header: () => "From Curr",
            }
          ),
        ],
      }),
    ],
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Grid container>
        {table.getAllLeafColumns().map((column) => {
          console.log(column);
          return (
            <Grid key={column.id} item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                }
                label={column.id}
              />
            </Grid>
          );
        })}
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    style={{ fontSize: 14, paddingBottom: 5, paddingTop: 5 }}
                    align="center"
                    key={header.id}
                    colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ExerciseTable3;
