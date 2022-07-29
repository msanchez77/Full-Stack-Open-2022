import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(state => state.notification);

  if (notification === null) {
    return <div className="notification blank"></div>;
  }

  const classes = `notification ${notification.type}`;

  return <div className={classes}>{notification.message}</div>;
};

export default Notification;
