import Inferno from 'inferno';
import {Link} from 'inferno-router';

const StartScreen = () => {
  return ( 
    <div class="startScreen fullView">
      <h1>TurboBallz</h1>
      <Link to="game"> <button>Play</button> </Link>
    </div>
  );
}

export default StartScreen;
