const { app, Menu, Tray } = require("electron");

class AppTray extends Tray {
  constructor(icon, mainWindow) {
    super(icon);

    this.setToolTip(`SysTop\nMonitor your CPU`);

    this.mainWindow = mainWindow;

    this.on("click", this.onClick.bind(this));
    this.on("right-click", this.onRightClick.bind(this));
  }

  onClick() {
    this.mainWindow.isVisible() === true
      ? this.mainWindow.hide()
      : this.mainWindow.show();
  }

  onRightClick() {
    const contenxtMenu = Menu.buildFromTemplate([
      {
        label: "Quit",
        click: () => {
          app.isQuitting = true;
          app.quit();
        },
      },
    ]);

    this.popUpContextMenu(contenxtMenu);
  }
}

module.exports = AppTray;
