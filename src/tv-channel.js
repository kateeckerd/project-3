// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.presenter = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      presenter: { type: String },
      video: { type: String }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: inline-flex;
      }

      .wrapper {
        line-height: 4px;
        min-width: 256px;
        margin-right: 4px;
        padding-left: 16px;
        padding-right: 16px;
        border: 1px solid #2c2c2c;
        border-radius: 8px;
      }

      .wrapper h5 {
        font-size: 1.125em;
        margin-bottom: 0.8888em;
        color: #363636;
      }
      
      p {
        font-size: 1em;
      }

      ::slotted(p) {
        line-height: 32px;
      }

    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
        <h5>${this.title}</h5>
        <p>${this.presenter}</p>
        <slot></slot>
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);

