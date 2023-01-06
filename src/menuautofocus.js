export default class MenuAutofocus {
  constructor(selector, options) {
    let defaultOptions = {
      duration: 0, // Задержка перед появлением фокуса
      autoFocusToMenu: false, // Автопереключение фокуса к меню
      autoFocusToCloseBtn: false, // Автопереключение фокуса к кнопке "закрыть меню"

      menuName: '[data-menu]',
      closeBtnName: '[data-close]',
      overlayName: '[data-menu-overlay]',
      menuActiveClass: 'nav--active',
    };

    this.options = Object.assign(defaultOptions, options);

    this.burger = document.querySelector(selector);
    this.menu = document.querySelector(this.options.menuName);
    this.closeBtn = document.querySelector(this.options.closeBtnName);
    this.overlay = document.querySelector(this.options.overlayName);

    this.focusElems = [
      'a[href]',
      'input',
      'button',
      'select',
      'textarea',
      '[tabindex]'
    ]

    this.menuFocusElems = null;

    this.events();
  }

  events() {
    document.addEventListener('DOMContentLoaded', () => {
      if (this.burger && this.menu && getComputedStyle(this.burger).display != 'none') {
        setTimeout(() => {
          this.getFocusElems();
          this.menuFocusElems.forEach((menuFocusEl) => {
            if (!this.menu.classList.contains(this.options.menuActiveClass)) {
              this.navigationOff(menuFocusEl);
            }
            document.addEventListener('click', (e) => {
              if (e.target == this.burger || e.target == this.closeBtn || e.target == this.overlay) {
                if (this.menu.classList.contains(this.options.menuActiveClass)) {
                  this.navigationOn(menuFocusEl);
                  this.focusToMenu(e);
                } else {
                  this.navigationOff(menuFocusEl);
                  this.focusToBurger(e);
                }
              }
            })
          })
          document.addEventListener('keydown', (e) => {
            if (e.target == this.burger && e.code == 'Tab' && this.menu.classList.contains(this.options.menuActiveClass)) {
              this.focusToMenu(e);
            }
            if (e.code == 'Tab' && this.menu.classList.contains(this.options.menuActiveClass)) {
              this.focusInMenu(e);
            }
          })
        });
      }

      window.addEventListener('resize', () => {
        if (getComputedStyle(this.burger).display != 'none') {
          setTimeout(() => {
            this.getFocusElems();
            this.menuFocusElems.forEach(menuFocusEl => {
              if (this.menu.classList.contains(this.options.menuActiveClass)) {
                this.navigationOn(menuFocusEl);
              } else {
                this.navigationOff(menuFocusEl);
              }
            })
          });
        } else {
          this.menuFocusElems.forEach(menuFocusEl => {
            this.navigationOn(menuFocusEl);
          })
        }
      })
    })
  }

  getFocusElems() {
    this.menuFocusElems = Array.from(this.menu.querySelectorAll(this.focusElems));
  }

  navigationOn(menuFocusEl) {
    menuFocusEl.removeAttribute('tabIndex');
    menuFocusEl.removeAttribute('disabled');
  }

  navigationOff(menuFocusEl) {
    menuFocusEl.tabIndex = -1;
    menuFocusEl.disabled = true;
  }

  focusToMenu(e) {
    if (this.options.autoFocusToMenu == true) {
      if (!e.shiftKey) {
        setTimeout(() => {
          this.menuFocusElems[0].focus();
          e.preventDefault();
        }, this.options.duration);
      }
    } else {
      if (!e.shiftKey && e.code == 'Tab') {
        this.menuFocusElems[0].focus();
        e.preventDefault();
      }
    }

    if (this.closeBtn) {
      if (this.options.autoFocusToCloseBtn) {
        setTimeout(() => {
          this.closeBtn.focus();
          e.preventDefault();
        }, this.options.duration);
      } else {
        setTimeout(() => {
          this.menuFocusElems[0].focus();
          e.preventDefault();
        }, this.options.duration);
      }
    }
  }

  focusInMenu(e) {
    const focusArray = Array.prototype.slice.call(this.menuFocusElems);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (this.closeBtn) {
      if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
        focusArray[0].focus();
        e.preventDefault();
      }
      if (e.shiftKey && focusedIndex === 0) {
        this.menuFocusElems[this.menuFocusElems.length - 1].focus();
        e.preventDefault();
      }
    } else {
      if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
        this.burger.focus();
        e.preventDefault();
      }
      if (e.shiftKey && e.target == this.burger) {
        this.menuFocusElems[this.menuFocusElems.length - 1].focus();
        e.preventDefault();
      }
      if (e.shiftKey && focusedIndex === 0) {
        this.burger.focus();
        e.preventDefault();
      }
    }
  }

  focusToBurger(e) {
    setTimeout(() => {
      this.burger.focus();
      e.preventDefault();
    }, this.options.duration);
  }
}