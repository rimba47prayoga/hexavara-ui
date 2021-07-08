import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import {
  deepOrange,
  deepPurple,
  pink,
  indigo,
  blue,
  teal,
} from "@material-ui/core/colors";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Skeleton from "@material-ui/lab/Skeleton/Skeleton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Customers() {
  const history = useHistory();
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [next, setNext] = useState("");
  const [isLoading, setLoading] = useState(false);
  let countColour = 0;
  const colours = {
    orange: {
      color: "#fff",
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: "#fff",
      backgroundColor: deepPurple[500],
    },
    pink: {
      color: "#fff",
      backgroundColor: pink[500],
    },
    indigo: {
      color: "#fff",
      backgroundColor: indigo[500],
    },
    blue: {
      color: "#fff",
      backgroundColor: blue[500],
    },
    teal: {
      color: "#fff",
      backgroundColor: teal[500],
    },
  };
  const [open, setOpen] = useState(false);
  const defaultSelected = {
    name: "",
    total_duration: {
      sum: "",
      count: "",
    },
    total_incoming: {
      sum: "",
      count: "",
    },
    total_outgoing: {
      sum: "",
      count: "",
    },
  };
  const [selected, setSelected] = useState(defaultSelected);

  const handleClickOpen = (item) => {
    setOpen(true);
    setSelected(item);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(defaultSelected);
  };

  const fetchCustomers = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/v1/customers`)
      .then((res) => {
        setItems(
          res.data.results.map((item) => {
            item.avatar_colour = getAvatarColour();
            return item;
          })
        );
        setNext(res.data.next);
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
        setItems(
          items.concat(
            res.data.results.map((item) => {
              item.avatar_colour = getAvatarColour();
              return item;
            })
          )
        );
        setNext(res.data.next);
      })
      .catch((errors) => {
        console.log(errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const initialCustomerName = (name) => {
    if (!name.length) return "";
    const names = name.split(" ");
    let result = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      let lastChar = names[1].charAt(0).toUpperCase();
      result = `${result}${lastChar}`;
    }
    return result;
  };

  const getAvatarColour = () => {
    const arrColours = Object.keys(colours);
    const result = arrColours[countColour];
    if (countColour >= 5) {
      countColour = 0;
    } else {
      countColour += 1;
    }
    return result;
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">Customer Info</DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <Box display="flex">
            <Box marginRight="20px">
              <Avatar style={colours[selected.avatar_colour]}>
                {initialCustomerName(selected.name)}
              </Avatar>
            </Box>
            <Box>
              <Box fontWeight="bold" fontSize="17px">
                {selected.name}
              </Box>
              <Box>{selected.phone}</Box>
            </Box>
          </Box>
          <Box marginTop="20px">
            <Box fontWeight="bold" fontSize="15px">
              Incoming
            </Box>
            <Box>{selected.total_incoming.count}x times</Box>
            <Box>durations: {selected.total_incoming.sum}s</Box>
          </Box>
          <Box marginTop="15px">
            <Box fontWeight="bold" fontSize="15px">
              Outgoing
            </Box>
            <Box>{selected.total_outgoing.count}x times</Box>
            <Box>durations: {selected.total_outgoing.sum}s</Box>
          </Box>
          <Box marginTop="15px">
            <Box fontWeight="bold" fontSize="15px">
              Total
            </Box>
            <Box>{selected.total_duration.count}x times</Box>
            <Box>durations: {selected.total_duration.sum}s</Box>
          </Box>
        </DialogContent>
      </Dialog>
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
              <ListItem
                button
                key={index}
                onClick={() => history.push(`/customers/${item.id}/history`)}
              >
                <ListItemAvatar>
                  <Avatar style={colours[item.avatar_colour]}>
                    {initialCustomerName(item.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.phone} />
                <ListItemSecondaryAction
                  style={{
                    color: "rgba(0, 0, 0, 0.54)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div>Total duration: {item.total_duration.sum}s</div>
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
