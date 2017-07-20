/* @flow */
import Inferno from 'inferno';
import Component from 'inferno-component';
import BallzScene from '../game/ballz-scene.js';

export default class ElementWrapper extends Component {
	constructor(props) {
		super(props);
		this.DOMNode = null;
    this.el = props.el;
	}
	render() {
		return <div ref={ domNode => this.DOMNode = domNode } />;
	}
	componentDidMount() {
    this.DOMNode.appendChild(this.el);
	}
}
