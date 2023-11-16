// import stuff
import { LitElement, html, css } from "lit";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = "";
    this.source = new URL("../assets/channels.json", import.meta.url).href;
    this.listings = [];
    this.activeItem = {
      id: null,
      title: null,
      presenter: null,
      description: null,
      video: null
    }
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return "tv-app";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block; 
      }

      header {
        color: #000;
        padding: 16px;
        text-align: center;
      }

      .h1 {
        font-size: 32px;
        margin-bottom: 16px;
      }

      /* .listing-container {
        justify-self: center;
        max-width: 1344px;
        justify-items: left;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: auto;
        padding-left: .5rem;
        padding-right: .5rem;
        text-rendering: optimizeLegibility;
        width: 100%;
        margin: 0 auto;
        position: relative;
        animation-delay: 1s;
        animation-duration: 1s;
        line-height: 1.5;
        font-size: 1em;
      } */ 

      .channel-container {
        margin-left: 16px;
        max-width: 96%;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: auto;
      }
      
      .player-container {
        margin: 32px 0 0 16px;
        border-radius: 8px;
        display: inline-flex;
      }

      .player {
        width: 900px;
        height: 500px;
        border-radius: 8px;
      }

      .discord {
        margin-left: 32px;
        width: 450px;
      }

      .discord widgetbot {
        display: inline-block;
        overflow: hidden;
        background-color: rgb(54, 57, 62);
        border-radius: 8px;
        vertical-align: top;
        width: 100%;
        height: 100%;
      }

      .discord iframe {
        border: none;
        width: 100%;
        height: 100%;
      }
      
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <header>
        <h1>${this.name}</h1>
      </header>
      <div class="channel-container">
        ${
          this.listings.map(
            (item) => html`
              <tv-channel 
                id="${item.id}"
                title="${item.title}"
                presenter="${item.metadata.author}"
                description="${item.metadata.description}"
                video="${item.metadata.source}"
                @click="${this.itemClick}">
              </tv-channel>
            `
          )
        }
      </div>

      <div class="player-container">
        <!-- video -->
        <iframe class="player"
          src="${this.createSource()}"
          frameborder="0"
          allowfullscreen>
        </iframe>
        <!-- discord / chat - optional -->
        <div class="discord">
          <widgetbot server="954008116800938044" channel="1106691466274803723" width="100%" height="100%"><iframe title="WidgetBot Discord chat embed" allow="clipboard-write; fullscreen" src="https://e.widgetbot.io/channels/954008116800938044/1106691466274803723?api=a45a80a7-e7cf-4a79-8414-49ca31324752"></iframe></widgetbot>
          <script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script>
        </div>
      </div>
      </div>
      <!-- dialog -->
      <sl-dialog label=" ${this.activeItem.title}" class="dialog">
        <p class="dialog-description">
          ${this.activeItem.author}
          ${this.activeItem.description}
        </p>
        <sl-button slot="footer" variant="primary" @click="${this.watchVideo}">Watch</sl-button>
      </sl-dialog>
    `;
  }

  changeVideo() {
    // Update the iframe source URL when an item is clicked
    const iframe = this.shadowRoot.querySelector('iframe');
    iframe.src = this.createSource();
  }
  
  extractVideoID(link) {
    try {
      const url = new URL(link);
      const searchParams = new URLSearchParams(url.search);
      return searchParams.get("v");    
    } catch (error) {
      console.error("Invalid URL:", link);
      return null;
    }
  }

  createSource() {
    return "https://www.youtube.com/embed/" + this.extractVideoID(this.activeItem.video);
  }

  closeDialog() {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  watchVideo() {
    this.changeVideo(); 
  }

  itemClick(e) {
    this.activeItem = {
      id: e.target.id,
      title: e.target.title,
      presenter: e.target.presenter,
      description: e.target.description,
      video: e.target.video
    };
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}

// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);