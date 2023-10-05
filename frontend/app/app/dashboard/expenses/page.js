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
import ExpensesDialog from "@/app/modals/expenses/expenses_dialog";
import LedgerDialog from "@/app/modals/expenses/ledger_dialog";
import Success from "@/app/utils/success";
import Loading from "@/app/utils/loading";
import useSWR from "swr";
import axiosInstance from "@/app/axios";
import PropTypes from "prop-types";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const ExpensesInformation = (props) => {
  const {
    id,
    setEditData,
    setIsEditing,
    setExpensesInfoMutate,
    setOpenExpensesDialog,
    setOpenLedgerDialog,
  } = props;
  const { data, error, isLoading, mutate } = useSWR("/expenses/" + id, fetcher);
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
    { id: 3, label: "Bad Debts", value: false },
  ]);

  const buttons = [
    <Button key="two" onClick={() => setOpenLedgerDialog(true)}>
      Ledger
    </Button>,
    <Button key="three">Summary</Button>,
    <Button
      key="four"
      startIcon={<EditIcon />}
      onClick={() => {
        setEditData(data);
        setIsEditing(true);
        setExpensesInfoMutate(() => mutate);
        setOpenExpensesDialog(true);
      }}
      color="secondary"
    >
      Edit
    </Button>,
  ];

  if (isLoading) return <Loading />;

  if (error) return <Typography>Unable to fetch data!</Typography>;

  return (
    <Card sx={{ padding: 2, position: "relative" }}>
      <Typography component="h2" variant="h6" color="primary" marginBottom={2}>
        Expenses Information
      </Typography>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        sx={{ marginBottom: 2 }}
        size="small"
      >
        {buttons}
      </ButtonGroup>
      <Grid item xs={8}></Grid>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          padding={1}
          spacing={1}
        >
          <Grid item xs={12} md={4}>
            <Typography>Account number:</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography>{data.account_number}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>Account name:</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography>{data.account_name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>Expenses Description:</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography>{data.expenses_description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>Expenses Category:</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography>{data.expenses_category.expenses_category}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>Account status:</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
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
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>Date created:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{data.created_at.split("T")[0]}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default function Expenses() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("/expenses", fetcher);
  const [openExpensesDialog, setOpenExpensesDialog] = useState(false);
  const [openLedgerDialog, setOpenLedgerDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const loading = open && options.length === 0;
  const [selected, setSelected] = useState(null);
  const [expensesInfoMutate, setExpensesInfoMutate] = useState();

  useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      setOptions(data);
    }
  }, [open, data]);

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
            placeholder="Search Account"
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

  if (error) return <Typography>Unable to fetch data!</Typography>;

  if (isLoading) return <Loading />;

  return (
    <>
      <Typography
        component="h2"
        variant="h5"
        color="primary"
        gutterBottom
        marginBottom={2}
      >
        Expenses Information
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenExpensesDialog(true)}
          color="primary"
          sx={{ marginLeft: 2 }}
        >
          Add
        </Button>
      </Typography>
      {search}
      <Box elevation={0} sx={{ padding: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Success
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            successText={successText}
          />
          {selected && (
            <Fade in={true}>
              <Box
                sx={{
                  padding: 2,
                  textAlign: "left",
                  justifyItems: "bottom",
                }}
              >
                <ExpensesInformation
                  id={selected.id}
                  setEditData={setEditData}
                  setIsEditing={setIsEditing}
                  setExpensesInfoMutate={setExpensesInfoMutate}
                  setOpenExpensesDialog={setOpenExpensesDialog}
                  setOpenLedgerDialog={setOpenLedgerDialog}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
      <ExpensesDialog
        openExpensesDialog={openExpensesDialog}
        setOpenExpensesDialog={setOpenExpensesDialog}
        setIsSuccess={setIsSuccess}
        setSuccessText={setSuccessText}
        mutate={!isEditing ? mutate : expensesInfoMutate}
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
            dialogName="Expenses Ledger"
          />
        </>
      )}
    </>
  );
}
