import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CallMade from "@material-ui/icons/CallMade";
import CallReceived from "@material-ui/icons/CallReceived";
import axios from "axios";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function HistoryCalls() {
  const classes = useStyles();
  const [items, setItems] = useState([]);

  const fetchHistory = (id) => {
    axios
      .get(`http://localhost:8000/api/v1/customers/${id}/history`)
      .then((res) => {
        setItems(res.data.results);
      });
  };

  const parseDate = (date) => {
    return moment(date).fromNow();
  };

  useEffect(() => {
    fetchHistory(73);
    console.log(items);
  }, []);

  return (
    <List className={classes.root}>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar>
              {item.type_call === "outgoing" ? <CallMade /> : <CallReceived />}
            </Avatar>
          </ListItemAvatar>
          {item.type_call === "outgoing" ? (
            <ListItemText primary={item.incoming.name} secondary="Outgoing" />
          ) : (
            <ListItemText primary={item.outgoing.name} secondary="Incoming" />
          )}
          <ListItemSecondaryAction style={{ color: "rgba(0, 0, 0, 0.54)" }}>
            {parseDate(item.dialed_on)}
            <IconButton edge="end" aria-label="delete">
              <InfoOutlinedIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
