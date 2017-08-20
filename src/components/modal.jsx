import Inferno from 'inferno';

const Modal = ({show, children}) => {
  if(show){
    return (<div class="modal">{children}</div>);
  }else{
    return null;
  }
}

export default Modal;
