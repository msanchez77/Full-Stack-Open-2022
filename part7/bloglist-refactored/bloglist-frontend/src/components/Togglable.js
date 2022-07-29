import { useState, cloneElement } from "react";
import PropTypes from "prop-types";

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };


  return (
    <div className="togglable-wrapper">
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} className="login-btn-open">
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {cloneElement(props.children, {toggleVisibility: toggleVisibility})}
        <button onClick={toggleVisibility} className="login-btn-close">
          cancel
        </button>
      </div>
    </div>
  );
};

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;
