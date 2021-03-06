import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CallMade from "@material-ui/icons/CallMade";
import CallReceived from "@material-ui/icons/CallReceived";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton/Skeleton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InfiniteScroll from "react-infinite-scroll-component";

import axios from "axios";
import moment from "moment";
import humanizeDuration from "humanize-duration";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function HistoryCalls(props) {
  const customer_id = props.match.params.id;
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [next, setNext] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
  });
  const [open, setOpen] = useState(false);
  const defaultSelected = {
    incoming: {
      name: "",
      phone: "",
    },
    outgoing: {
      name: "",
      phone: "",
    },
    type_call: "",
    duration: "",
  };
  const [selected, setSelected] = useState(defaultSelected);

  const handleClickOpen = (item) => {
    setOpen(true);
    if (item.type_call === "outgoing") {
      item.outgoing = defaultSelected.outgoing;
    } else {
      item.incoming = defaultSelected.incoming;
    }
    setSelected(item);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(defaultSelected);
  };

  const fetchHistory = (id) => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/v1/customers/${id}/history`)
      .then((res) => {
        setItems(res.data.results);
        setNext(res.data.next);
      })
      .catch((errors) => {
        console.log(errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchCustomer = (id) => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/v1/customers/${id}`)
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((errors) => {
        console.log(errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchMoreData = () => {
    axios
      .get(next)
      .then((res) => {
        setItems(items.concat(res.data.results));
        setNext(res.data.next);
      })
      .catch((errors) => {
        console.log(errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const parseDate = (date) => {
    return moment(date).fromNow();
  };

  useEffect(() => {
    fetchHistory(customer_id);
    fetchCustomer(customer_id);
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">Detail History</DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <Box display="flex">
            <Box marginRight="20px">
              <Avatar></Avatar>
            </Box>
            <Box>
              <Box fontWeight="bold" fontSize="17px">
                {selected.type_call === "outgoing"
                  ? selected.incoming.name
                  : selected.outgoing.name}
              </Box>
              <Box>
                {selected.type_call === "outgoing"
                  ? selected.incoming.phone
                  : selected.outgoing.phone}
              </Box>
            </Box>
          </Box>
          <Box marginTop="20px">
            <Box
              fontWeight="bold"
              fontSize="15px"
              display="flex"
              alignItems="center"
            >
              <CallReceived
                style={{
                  fontSize: "15px",
                  marginRight: "10px",
                }}
              />
              {selected.type_call === "outgoing"
                ? "Outgoing call"
                : "Incoming call"}
            </Box>
            <Box>{humanizeDuration(selected.duration * 1000)}</Box>
          </Box>
          <Box marginTop="15px">
            <Box fontWeight="bold" fontSize="15px">
              Date
            </Box>
            <Box>{selected.dialed_on}</Box>
          </Box>
        </DialogContent>
      </Dialog>
      {!customer.name.length ? (
        <Skeleton height={50} width={300} style={{ marginBottom: "20px" }} />
      ) : (
        <Box fontWeight="bold" fontSize="25px" marginBottom="20px">
          {customer.name}'s history
        </Box>
      )}
      {isLoading ? (
        <div>
          <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
          <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
          <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
          <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
          <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
          <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
        </div>
      ) : (
        <List className={classes.root}>
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={next !== null}
            loader={
              <div>
                <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
                <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
                <Skeleton height={80} style={{ transform: "scale(1, 0.9)" }} />
              </div>
            }
          >
            {items.map((item, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    {item.type_call === "outgoing" ? (
                      <CallMade />
                    ) : (
                      <CallReceived />
                    )}
                  </Avatar>
                </ListItemAvatar>
                {item.type_call === "outgoing" ? (
                  <ListItemText
                    primary={item.incoming.name}
                    secondary="Outgoing"
                  />
                ) : (
                  <ListItemText
                    primary={item.outgoing.name}
                    secondary="Incoming"
                  />
                )}
                <ListItemSecondaryAction
                  style={{
                    color: "rgba(0, 0, 0, 0.54)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div>{parseDate(item.dialed_on)}</div>
                    <div>{humanizeDuration(item.duration * 1000)}</div>
                  </div>
                  <IconButton
                    edge="end"
                    aria-label="info"
                    onClick={() => handleClickOpen(item)}
                  >
                    <InfoOutlinedIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </InfiniteScroll>
        </List>
      )}
    </div>
  );
}
