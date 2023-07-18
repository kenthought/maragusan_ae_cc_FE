"use client";

import { Fragment, useEffect, useState } from "react";
import Fade from "@mui/material/Fade";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CssBaseline from "@mui/material/CssBaseline";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import OwnersEquityDialog from "@/app/modals/owners_equity/owners_equity_dialog";
import LedgerDialog from "@/app/modals/asset/ledger_dialog";
import DepreciationLedgerDialog from "@/app/modals/asset/depreciation_ledger_dialog";
import Success from "@/app/utils/success";
import useSWR from "swr";
import axiosInstance from "@/app/axios";
import PropTypes from "prop-types";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const OwnersEquityInformation = (props) => {
  const {
    id,
    setEditData,
    setIsEditing,
    setOwnersEquityInfoMutate,
    setOpenOwnersEquityDialog,
  } = props;
  const { data, error, isLoading, mutate } = useSWR(
    "/owners_equity/" + id,
    fetcher
  );
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
    { id: 3, label: "Bad Debts", value: false },
  ]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Unable to fetch data!</div>;

  return (
    <Card sx={{ padding: 2, position: "relative" }}>
      <Typography component="h2" variant="h6" color="primary" margin={1}>
        Owners Equity Information
        <Fab
          color="secondary"
          size="small"
          aria-label="edit"
          sx={{
            marginLeft: 2,
          }}
        >
          <Tooltip title="Edit">
            <EditIcon
              onClick={() => {
                setEditData(data);
                setIsEditing(true);
                setOwnersEquityInfoMutate(() => mutate);
                setOpenOwnersEquityDialog(true);
              }}
            />
          </Tooltip>
        </Fab>
      </Typography>
      <Grid item xs={8}></Grid>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          padding={1}
          spacing={1}
        >
          <Grid item xs={4}>
            <Typography>Account number:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.account_number}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Account name:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.account_name}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Purok/Street:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.purok_street}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Barangay:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.barangay.barangay}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Municipality:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.municipality.municipality}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Province:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.province.province}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Account status:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>
              <Chip
                label={accountStatus[data.account_status - 1].label}
                color={
                  accountStatus[data.account_status - 1].id == 1
                    ? "success"
                    : accountStatus[data.account_status - 1].id == 2
                    ? "error"
                    : "secondary"
                }
              />
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Date created:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.created_at.split("T")[0]}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default function OwnersEquity() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("/owners_equity", fetcher);
  const [openOwnersEquityDialog, setOpenOwnersEquityDialog] = useState(false);
  const [openLedgerDialog, setOpenLedgerDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const loading = open && options.length === 0;
  const [selected, setSelected] = useState(null);
  const [ownersEquityInfoMutate, setOwnersEquityInfoMutate] = useState();

  useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      setOptions(data);
    }
  }, [open]);

  const search = (
    <>
      <Autocomplete
        freeSolo
        id="asynchronous-demo"
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(event, newValue) => {
          console.log(newValue);
          setSelected(newValue);
        }}
        size="small"
        isOptionEqualToValue={(option, value) =>
          option.account_name === value.title
        }
        getOptionLabel={(option) => option.account_name}
        options={options}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.account_name}
            </li>
          );
        }}
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option, index) => (
            <Chip {...getTagProps({ index })} key={option} label={option} />
          ));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Account"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <SearchIcon color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    </>
  );

  const buttons = [
    <Button key="two" onClick={() => setOpenLedgerDialog(true)}>
      Ledger
    </Button>,
    <Button key="three">Summary</Button>,
  ];

  return (
    <>
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        Owner's Equity
      </Typography>
      <Divider />
      <Box elevation={0} sx={{ padding: 2 }}>
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Success
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            successText={successText}
          />
          <Grid container marginBottom={1}>
            <Grid item xs={11}>
              {search}
            </Grid>
            <Grid item xs={1}>
              <Fab
                color="primary"
                size="small"
                aria-label="add"
                onClick={() => setOpenOwnersEquityDialog(true)}
              >
                <Tooltip title="Add">
                  <AddIcon />
                </Tooltip>
              </Fab>
            </Grid>
          </Grid>
          {selected && (
            <Fade in={true}>
              <Box
                sx={{ padding: 2, textAlign: "left", justifyItems: "bottom" }}
              >
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                  sx={{ marginBottom: 2 }}
                  size="small"
                >
                  {buttons}
                </ButtonGroup>
                <OwnersEquityInformation
                  id={selected.id}
                  setEditData={setEditData}
                  setIsEditing={setIsEditing}
                  setOwnersEquityInfoMutate={setOwnersEquityInfoMutate}
                  setOpenOwnersEquityDialog={setOpenOwnersEquityDialog}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
      <OwnersEquityDialog
        openOwnersEquityDialog={openOwnersEquityDialog}
        setOpenOwnersEquityDialog={setOpenOwnersEquityDialog}
        setIsSuccess={setIsSuccess}
        setSuccessText={setSuccessText}
        mutate={!isEditing ? mutate : ownersEquityInfoMutate}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editData={editData}
      />
    </>
  );
}