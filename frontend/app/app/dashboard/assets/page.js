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
import AssetDialog from "@/app/modals/asset/asset_dialog";
import LedgerDialog from "@/app/modals/asset/ledger_dialog";
import DepreciationLedgerDialog from "@/app/modals/asset/depreciation_ledger_dialog";
import Success from "@/app/utils/success";
import useSWR from "swr";
import axiosInstance from "@/app/axios";
import PropTypes from "prop-types";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const AssetInformation = (props) => {
  const {
    id,
    setEditData,
    setIsEditing,
    setAssetInfoMutate,
    setOpenAssetDialog,
  } = props;
  const { data, error, isLoading, mutate } = useSWR("/asset/" + id, fetcher);
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
        Asset Information
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
                setAssetInfoMutate(() => mutate);
                setOpenAssetDialog(true);
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
            <Typography>Asset description:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.asset_description}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Asset type:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.asset_type.asset_type}</Typography>
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

AssetInformation.propTypes = {
  id: PropTypes.number.isRequired,
  setEditData: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  setAssetInfoMutate: PropTypes.func.isRequired,
  setOpenAssetDialog: PropTypes.func.isRequired,
};

export default function Assets() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("/asset", fetcher);
  const [openAssetDialog, setOpenAssetDialog] = useState(false);
  const [openLedgerDialog, setOpenLedgerDialog] = useState(false);
  const [openDepreciationLedgerDialog, setOpenDepreciationLedgerDialog] =
    useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const loading = open && options.length === 0;
  const [selected, setSelected] = useState(null);
  const [assetInfoMutate, setAssetInfoMutate] = useState();

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
    <Button key="one" onClick={() => setOpenDepreciationLedgerDialog(true)}>
      Depreciation Ledger
    </Button>,
    <Button key="two" onClick={() => setOpenLedgerDialog(true)}>
      Ledger
    </Button>,
    <Button key="three">Summary</Button>,
  ];

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error occured while fetching Data!</div>;

  return (
    <>
      <Typography component="h2" variant="h5" color="primary">
        Assets
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
                onClick={() => setOpenAssetDialog(true)}
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
                <AssetInformation
                  id={selected.id}
                  setEditData={setEditData}
                  setIsEditing={setIsEditing}
                  setAssetInfoMutate={setAssetInfoMutate}
                  setOpenAssetDialog={setOpenAssetDialog}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
      <AssetDialog
        openAssetDialog={openAssetDialog}
        setOpenAssetDialog={setOpenAssetDialog}
        setIsSuccess={setIsSuccess}
        setSuccessText={setSuccessText}
        mutate={!isEditing ? mutate : assetInfoMutate}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editData={editData}
      />
      {selected && (
        <>
          <LedgerDialog
            openLedgerDialog={openLedgerDialog}
            setOpenLedgerDialog={setOpenLedgerDialog}
            selected={selected}
            dialogName="Asset Ledger"
          />
          <DepreciationLedgerDialog
            openDepreciationLedgerDialog={openDepreciationLedgerDialog}
            setOpenDepreciationLedgerDialog={setOpenDepreciationLedgerDialog}
            selected={selected}
          />
        </>
      )}
    </>
  );
}
