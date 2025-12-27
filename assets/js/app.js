import { KitchenDesignApp } from './KitchenDesignApp.js';

/* wait for DOM before bootstrapping */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => new KitchenDesignApp());
} else {
  new KitchenDesignApp();
}