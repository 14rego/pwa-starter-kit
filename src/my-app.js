import { Element } from '../../@polymer/polymer/polymer-element.js';
import '../../@polymer/app-layout/app-drawer/app-drawer.js';
import '../../@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '../../@polymer/app-layout/app-header/app-header.js';
import '../../@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../../@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '../../@polymer/app-layout/app-toolbar/app-toolbar.js';
import '../../@polymer/app-route/app-location.js';
import '../../@polymer/app-route/app-route.js';
import '../../@polymer/iron-pages/iron-pages.js';
import '../../@polymer/iron-selector/iron-selector.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';
import './my-view1.js';
import './my-view2.js';
import './my-view3.js';
import './my-view404.js';
import { importHref } from '../../@polymer/polymer/lib/utils/import-href.js';
class MyApp extends Element {
  static get template() {
    return `
    <style>
      :host {
        --app-primary-color: #4285f4;
        --app-secondary-color: black;

        display: block;
      }

      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }

      app-header {
        color: #fff;
        background-color: var(--app-primary-color);
      }

      app-header paper-icon-button {
        --paper-icon-button-ink-color: white;
      }

      .drawer-list {
        margin: 0 20px;
      }

      .drawer-list a {
        display: block;
        padding: 0 16px;
        text-decoration: none;
        color: var(--app-secondary-color);
        line-height: 40px;
      }

      .drawer-list a.iron-selected {
        color: black;
        font-weight: bold;
      }
    </style>

    <app-location route="{{route}}" url-space-regex="^[[rootPath]]"></app-location>
    <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}"></app-route>

    <app-drawer-layout fullbleed="" narrow="{{narrow}}">
      <!-- Drawer content -->
      <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
        <app-toolbar>Menu</app-toolbar>
        <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
          <a name="view1" href="[[rootPath]]view1">View One</a>
          <a name="view2" href="[[rootPath]]view2">View Two</a>
          <a name="view3" href="[[rootPath]]view3">View Three</a>
        </iron-selector>
      </app-drawer>

      <!-- Main content -->
      <app-header-layout has-scrolling-region="">

        <app-header slot="header" condenses="" reveals="" effects="waterfall">
          <app-toolbar>
            <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
            <div main-title="">My App</div>
          </app-toolbar>
        </app-header>

        <iron-pages selected="[[page]]" attr-for-selected="name" fallback-selection="view404" role="main">
          <my-view1 name="view1"></my-view1>
          <my-view2 name="view2"></my-view2>
          <my-view3 name="view3"></my-view3>
          <my-view404 name="view404"></my-view404>
        </iron-pages>
      </app-header-layout>
    </app-drawer-layout>
`;
  }

  static get is() { return 'my-app'; }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged',
      },
      routeData: Object,
      subroute: String,
      // This shouldn't be neccessary, but the Analyzer isn't picking up
      // Polymer.Element#rootPath
      rootPath: String,
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)',
    ];
  }

  _routePageChanged(page) {
    // If no page was found in the route data, page will be an empty string.
    // Deault to 'view1' in that case.
    this.page = page || 'view1';

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Load page import on demand. Show 404 page if fails
    var resolvedPageUrl = this.resolveUrl('my-' + page + '.html');
    importHref(
        resolvedPageUrl,
        null,
        this._showPage404.bind(this),
        true);
  }

  _showPage404() {
    this.page = 'view404';
  }
}

window.customElements.define(MyApp.is, MyApp);
