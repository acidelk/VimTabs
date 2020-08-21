const BackgroundCommands = {
  selectNextTab(tabs) { return switchTab("next", tabs); },
  selectPreviousTab(tabs) { return switchTab("previous", tabs); },
  moveTabRight(tabs) { return moveTab("right", tabs); },
  moveTabLeft(tabs) { return moveTab("left", tabs); }
}

var switchTab = function(direction, tabs) {
    var activeTab = tabs.find(tab => tab.active);
    var toSelect =
      (() => { switch (direction) {
        case "next":
          return (activeTab.index + 1) % tabs.length;
        case "previous":
          return ((activeTab.index - 1) + tabs.length) % tabs.length;
      } })();
    chrome.tabs.update(tabs[toSelect].id, {active: true});
};

var moveTab = function (direction, tabs) {
    var activeTab = tabs.find(tab => tab.active);
    var pinnedCount = tabs.filter(tab => tab.pinned).length;
    var left = activeTab.pinned ? 0 : pinnedCount;
    var right = (activeTab.pinned ? pinnedCount : tabs.length) - 1;
    var idx = (() => {
        switch (direction) {
        case "right":
          return activeTab.index === right ? left : activeTab.index + 1;
        case "left":
          return activeTab.index === left ? right : activeTab.index - 1;
      }
    })();
  chrome.tabs.move(activeTab.id, { index: idx })

}
chrome.commands.onCommand.addListener(function (command) {
  chrome.tabs.query({ currentWindow: true }, BackgroundCommands[command]);
});
