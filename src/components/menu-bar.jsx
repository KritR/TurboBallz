/* @flow */
import Inferno from 'inferno';

const MenuBar = (props) => {
  return (
    <div class="menuBar">
      <button class="pause" onClick={props.onClick}></button>
      <h3>{props.level}</h3>
    </div>
  );
};

export default MenuBar;
